import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'

// Clean up mocks after each test to prevent data leaking between tests
afterEach(() => {
  vi.restoreAllMocks()
})