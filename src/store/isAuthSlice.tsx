import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const isAuthSlice = createSlice({
  name: "isAuthenticating",
  initialState: {
    isAuthenticating: false
  },
  reducers: {
    setIsAuthenticating(state, action: PayloadAction<boolean>) {
      state.isAuthenticating = action.payload
    }
  }
})

export const { setIsAuthenticating } = isAuthSlice.actions
export default isAuthSlice.reducer