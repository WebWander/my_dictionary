import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App'; 

test('handles input change and button click', async () => {
  render(<App />);

  const searchInput = screen.getByTestId('search-input');
  const searchButton = screen.getByTestId('search-button');

  // Simulate typing in the input
  fireEvent.change(searchInput, { target: { value: 'test' } });

  // Simulate clicking the search button
  fireEvent.click(searchButton);

  // Wait for the result to appear
  await waitFor(() => {
    expect(screen.getByText((content) => content.includes('Word: test'))).toBeInTheDocument();
  });
});

test('shows error message when input is empty and search is clicked', async () => {
  render(<App />);

  const searchButton = screen.getByTestId('search-button');

  // Simulate clicking the search button without entering a word
  fireEvent.click(searchButton);

  // Wait for error message to appear
  await waitFor(() => {
    expect(screen.getByText((content) => content.includes('Please enter a word'))).toBeInTheDocument();
  });
});


// 
test('shows error message when the API returns an error', async () => {
  render(<App />);

  const searchInput = screen.getByTestId('search-input');
  const searchButton = screen.getByTestId('search-button');

  // Simulate typing in the input
  fireEvent.change(searchInput, { target: { value: 'errorTest' } });

  // Simulate clicking the search button
  fireEvent.click(searchButton);

  // Wait for error message to appear
  await waitFor(() => {
    // Use a custom matcher to handle dynamic content
    expect(screen.getByText((content) => content.includes('This word is not available'))).toBeInTheDocument();
  });
});

test('handles fetch errors gracefully', async () => {
  render(<App />);

  const searchInput = screen.getByTestId('search-input');
  const searchButton = screen.getByTestId('search-button');

  // Simulate typing in the input
  fireEvent.change(searchInput, { target: { value: 'fetchErrorTest' } });

  // Simulate clicking the search button
  fireEvent.click(searchButton);

  // Wait for graceful error handling
  await waitFor(() => {
    // Expect some form of error display
    expect(screen.getByText((content) => content.includes('This word is not available'))).toBeInTheDocument();
  });
});
