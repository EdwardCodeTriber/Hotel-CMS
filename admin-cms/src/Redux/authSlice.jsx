import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase";

// Async action to handle user login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  // Async action to handle user logout
  export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
      try {
        await signOut(auth);
        return true;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  const authSlice = createSlice({
    name: "auth",
    initialState: {
      user: null,
      error: null,
      loading: false,
    },
    reducers: {
      setUser: (state, action) => {
        state.user = action.payload;
      },
      logout: (state) => {
        state.user = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(loginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(logoutUser.fulfilled, (state) => {
          state.user = null;
        });
    },
  });
  
  export const { setUser, logout } = authSlice.actions;
  export default authSlice.reducer;