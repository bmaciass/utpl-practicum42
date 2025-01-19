type Nil<T> = {
  [P in keyof T]: T[P] | null | undefined
}
