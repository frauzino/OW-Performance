import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, screen } from '@testing-library/react';
import { Popup } from './popup';

describe('Popup', () => {
  it('renders without crashing', () => {
    render(<Popup show={true} onClose={() => {}} />);
    expect(screen.getByText('Thanks for using Overwise!')).toBeInTheDocument();
  });

  it('does not render when show is false', () => {
    render(<Popup show={false} onClose={() => {}} />);
    expect(screen.queryByText('Thanks for using Overwise!')).toBeNull();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Popup show={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Not right now'));
    expect(onClose).toHaveBeenCalled();
  });
});
