import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../services/postService";

interface PostState {
  posts: Post[];
  loading: boolean;
}

const initialState: PostState = {
  posts: [],
  loading: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    setPostLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addNewPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload); // අලුත් එක උඩටම දාන්න
    },
  },
});

export const { setPosts, setPostLoading, addNewPost } = postSlice.actions;
export default postSlice.reducer;