import { createApi } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const USER_API = `${API_BASE_URL}user/`;

// the actual API integeration works here

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
        headers: {
          "Content-Type": "application/json",
        },
        // send this data to user , this input data coming from Login page.
      }),
    }),

    LoginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData, // sending data to backend  like  when u make posts request when fetching API  using post method
      }),

      // its to full fill the the need to usser means what they want to show
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled; // collecting response from server

          dispatch(userLoggedIn({ user: result.data.user })); // stores the user data in redux store
          
        } catch (error) {
          console.log(error);
        }
      },
    }),

    logoutUser: builder.mutation({
      query: ()=>({
        url:"logout",
        method:"POST"
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut()); // stores the user data in redux store
        } catch (error) {
          console.log(error);
        }
      },

      
    }),



    loadUser: builder.query({
      query: () =>({
        url:"profile",
        method:"GET"
      }),

       async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled; // collecting response from server

          dispatch(userLoggedIn({ user: result.data.user })); // stores the user data in redux store
        } catch (error) {
          console.log(error);
        }
      },
    }),

    updateUser :builder.mutation({

      query:(formData)=>({
        url:"profile/update",
        method:"PUT",
        body:formData,
        credentials:"include"
      })

    })



  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useLoadUserQuery,useUpdateUserMutation,useLogoutUserMutation } = authApi;
