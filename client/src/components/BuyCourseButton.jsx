import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, { isLoading,data,isSuccess,isError,error }] =
    useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };

  useEffect(()=>{

    if(isSuccess)
    {
      if(data?.url)
      {
        window.location.href = data.url  // redirects to stript checkout url
      } else {
        toast.error("Invalid response from server")
      }
    }

    if(isError)
    {
        toast.error(error?.data?.message || "Failed to checkout")
    }

  },[data,isSuccess,isError,error])

  return (
    <Button
      clasName="w-full bg-black text-white"
      disabled={isLoading}
      onClick={purchaseCourseHandler}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          please wait
        </>
      ) : (
        " Purchase course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
