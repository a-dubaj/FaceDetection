import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewPost from '../components/NewPost';

// face-api.js wymaga TensorFlow i ładowania modeli z sieci — mockujemy cały moduł,
// żeby testy nie próbowały robić realnych operacji ML/sieciowych.
jest.mock('face-api.js', () => ({
  nets: {
    tinyFaceDetector: { loadFromUri: jest.fn().mockResolvedValue() },
    faceLandmark68Net: { loadFromUri: jest.fn().mockResolvedValue() },
    faceExpressionNet: { loadFromUri: jest.fn().mockResolvedValue() },
  },
  detectAllFaces: jest.fn().mockResolvedValue([
    { box: { x: 10, y: 20, width: 50, height: 60 } },
  ]),
  TinyFaceDetectorOptions: jest.fn(),
}));

const mockImage = { url: 'https://example.com/photo.jpg', width: 400, height: 300 };

describe('NewPost', () => {
  test('renders without crashing', async () => {
    render(<NewPost image={mockImage} />);
    // poczekaj aż useEffect zakończy ładowanie "modeli" i detekcję twarzy
    await waitFor(() => expect(screen.getAllByPlaceholderText('Tag a friend')).toHaveLength(1));
  });

  test('renders the image with the correct src', () => {
    render(<NewPost image={mockImage} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockImage.url);
  });

  test('renders "Share your post" heading', () => {
    render(<NewPost image={mockImage} />);
    expect(screen.getByText('Share your post')).toBeInTheDocument();
  });

  test('renders the Send button', () => {
    render(<NewPost image={mockImage} />);
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  test('renders one "Tag a friend" input per detected face', async () => {
    render(<NewPost image={mockImage} />);
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Tag a friend')).toHaveLength(1);
    });
  });

  test('typing a friend name updates the "with" list', async () => {
    render(<NewPost image={mockImage} />);

    const input = await screen.findByPlaceholderText('Tag a friend');
    fireEvent.change(input, { target: { name: 'input0', value: 'Kasia' } });

    expect(await screen.findByText(/Kasia/)).toBeInTheDocument();
  });
});