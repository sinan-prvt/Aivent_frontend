import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FloatingAIAssistant from './FloatingAIAssistant'
import React from 'react'

describe('FloatingAIAssistant', () => {
    it('renders the chatbot icon', () => {
        render(<FloatingAIAssistant />)
        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
    })

    it('opens the chat window when clicked', () => {
        render(<FloatingAIAssistant />)
        const button = screen.getByRole('button')
        fireEvent.click(button)
        // Assuming the chat window has some identifying text or role
        // This is just a sample based on common patterns
        expect(screen.getByPlaceholderText(/Ask me anything/i) || screen.getByText(/AI Assistant/i)).toBeInTheDocument()
    })
})
