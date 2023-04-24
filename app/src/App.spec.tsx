import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from './App';

describe('App', () => {
  test('renders Home component when path is /', () => {
    render(
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    );

    expect(screen.getByText('Welcome to the Movie Sharing App!')).toBeInTheDocument();
  });

  test('renders Share component when path is /share', () => {
    render(
      <Router>
        <Routes>
          <Route path="/share" element={<App />} />
        </Routes>
      </Router>
    );

    expect(screen.getByLabelText('Youtube URL')).toBeInTheDocument();
  });
});
