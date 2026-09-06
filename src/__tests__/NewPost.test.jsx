import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as faceapi from 'face-api.js';
import NewPost from '../components/NewPost';

jest.mock('face-api.js', () => ({
  __esModule: true,
  nets: {
    tinyFaceDetector: { loadFromUri: jest.fn() },
    faceLandmark68Net: { loadFromUri: jest.fn() },
    faceExpressionNet: { loadFromUri: jest.fn() },
  },
  detectAllFaces: jest.fn(),
  TinyFaceDetectorOptions: jest.fn(),
}));

const mockImage = { url: 'https://example.com/photo.jpg', width: 400, height: 300 };
const mockDetections = [{ box: { x: 10, y: 20, width: 50, height: 60 } }];

beforeEach(() => {
  faceapi.nets.tinyFaceDetector.loadFromUri.mockResolvedValue();
  faceapi.nets.faceLandmark68Net.loadFromUri.mockResolvedValue();
  faceapi.nets.faceExpressionNet.loadFromUri.mockResolvedValue();
  faceapi.detectAllFaces.mockResolvedValue(mockDetections);
});

describe('NewPost', () => {
  test('renders without crashing and shows a "Tag a friend" input per detected face', async () => {
    render(<NewPost image={mockImage} />);
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Tag a friend')).toHaveLength(1);
    });
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

  test('typing a friend name updates the "with" list', async () => {
    render(<NewPost image={mockImage} />);

    const input = await screen.findByPlaceholderText('Tag a friend');
    fireEvent.change(input, { target: { name: 'input0', value: 'Kasia' } });

    expect(await screen.findByText(/Kasia/)).toBeInTheDocument();
  });
});