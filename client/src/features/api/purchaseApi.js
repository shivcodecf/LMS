import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const COURSE_PURCHASE_API = `${API_BASE_URL}purchase/`;

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
    }),

    getCourseDetailWithstatus : builder.query({
        query:(courseId)=>({
            url:`/course/${courseId}/detail-with-status`,
            method:"GET"
        })
    }),

     getPurchasedCourses : builder.query({
        query:()=>({
            url:`/`,
            method:"GET"
        })
    }),


    
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithstatusQuery,
  useGetPurchasedCoursesQuery
 
} = purchaseApi;