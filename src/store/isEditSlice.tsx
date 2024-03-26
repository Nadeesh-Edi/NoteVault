import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const isEditSlice = createSlice({
  name: "isEdit",
  initialState: {
    isEdit: false
  },
  reducers: {
    setIsEdit(state, action: PayloadAction<boolean>) {
      state.isEdit = action.payload
    }
  }
})

export const { setIsEdit } = isEditSlice.actions
export default isEditSlice.reducer