import { configureStore } from '@reduxjs/toolkit';
import selectedIdReducer from './selectedIdSlicer';
import isEditReducer from './isEditSlice'

export const store = configureStore({
    reducer: {
        selectedId: selectedIdReducer,
        isEdit: isEditReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: ['isEdit/setIsEdit', 'selectedId/setSelectedId', 'selectedId/setSelectedTitle', 'selectedId/setSelectedContent'],
            // Ignore these field paths in all actions
            ignoredActionPaths: ['payload'],
            // Ignore these paths in the state
            ignoredPaths: ['selectedId.selectedId'],
        },
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;