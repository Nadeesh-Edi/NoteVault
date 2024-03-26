import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Realm } from '@realm/react'

interface SelectedIdState {
  selectedId: Realm.BSON.ObjectId;
  selectedTitle: string;
  selectedContent: string;
}

const initialState: SelectedIdState = {
  selectedId: new Realm.BSON.ObjectId(),
  selectedTitle: "",
  selectedContent: ""
};

const selectedIdSlice = createSlice({
  name: "selectedId",
  initialState,
  reducers: {
    setSelectedId(state, action: PayloadAction<Realm.BSON.ObjectId>) {
      state.selectedId = action.payload
    },
    setSelectedTitle(state, action: PayloadAction<string>) {
      state.selectedTitle = action.payload
    },
    setSelectedContent(state, action: PayloadAction<string>) {
      state.selectedContent = action.payload
    }
  }
})

export const { setSelectedId, setSelectedTitle, setSelectedContent } = selectedIdSlice.actions
export default selectedIdSlice.reducer