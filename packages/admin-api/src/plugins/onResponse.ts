import type { Plugin } from 'graphql-yoga'

export function useResponse(): Plugin {
  return {
    onResponse({ serverContext }) {
      // FIXME: Context should be typed
      // biome-ignore lint/suspicious/noExplicitAny: not easily typed
      ;(serverContext as any).client.end()
    },
  }
}
