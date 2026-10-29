declare module 'axios' {
  interface InternalAxiosRequestConfig {
    __retryCount?: number
  }
}
