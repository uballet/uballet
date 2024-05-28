import React from 'react';
import { render, screen } from '@testing-library/react-native'
import { Pill } from './Pill'

describe('Pill', () => {
    it('should render text', () => {
        render(<Pill text='Hello' />)

        expect(screen.getByText('Hello')).toBeOnTheScreen()
    })
})