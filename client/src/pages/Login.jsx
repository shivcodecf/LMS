import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRegisterUserMutation, useLoginUserMutation} from "@/features/api/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


const Login = () => {

  const navigate = useNavigate();

  const [signupInput, setSignupInput] = useState({
  name: "",
  email: "",
  password: "",
  role: "student", // default role
});


  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
    role:"",
  });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSucess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSucess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const eventClickHandler = (e, type) => {

    const { name, value } = e.target;

    if (type == "login") {
      setLoginInput({ ...loginInput, [name]: value });
    } else {
      setSignupInput({ ...signupInput, [name]: value });
    }

  };

  const handleregistration = async (type) => {
    
    const data = type === "login" ? loginInput : signupInput;
    console.log(data);
    const action = type === "signup" ? registerUser : loginUser;

    await action(data);  // we send this data to authApi.js

  };

  useEffect(() => {

  if (registerIsSuccess || registerData) {
    console.log("Success Register:", registerData);
    toast.success(registerData.message || "Registered Successfully");
  }

  if (registerError) {
    toast.error(registerError?.data?.message || "Registration Failed");
  }

  if (loginIsSuccess || loginData) {
    console.log("Success Login:", loginData);

    toast.success(loginData.message || "Login Successful");

    navigate("/")
  }

  if (loginError) {
    toast.error(loginError?.data?.message || "Login Failed");
  }

}, [
  loginIsSuccess,
  registerIsSuccess,
  loginData,
  registerData,
  loginError,
  registerError,
]);





  return (
    <div className="flex items-center justify-center mt-20 dark:text-white">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup" >
            Signup
          </TabsTrigger>
          <TabsTrigger value="login" >Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>Join Our Community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => eventClickHandler(e, "signup")}
                  placeholder="Eg.  shivam"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => eventClickHandler(e, "signup")}
                  required
                  placeholder="Eg. shivam@#123"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  onChange={(e) => eventClickHandler(e, "signup")}
                  value={signupInput.password}
                  placeholder=""
                  required
                />
              </div>  

              <div className="space-y-1">
  <Label>Role</Label>
  <div className="flex gap-4">
    <label className="flex items-center gap-1">
      <input
        type="radio"
        name="role"
        value="student"
        checked={signupInput.role === "student"}
        onChange={(e) => eventClickHandler(e, "signup")}
      />
      Student
    </label>
    <label className="flex items-center gap-1">
      <input
        type="radio"
        name="role"
        value="instructor"
        checked={signupInput.role === "instructor"}
        onChange={(e) => eventClickHandler(e, "signup")}
      />
      Instructor
    </label>
  </div>
</div>



            </CardContent>
            <CardFooter>
              <Button
                className="bg-black text-white"
                disabled={registerIsLoading}
                onClick={() => handleregistration("signup")}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Good to See You Again!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  onChange={(e) => eventClickHandler(e, "login")}
                  value={loginInput.email}
                  required
                  placeholder="Eg. shivam@#123"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">password</Label>
                <Input
                  type="password"
                  name="password"
                  onChange={(e) => eventClickHandler(e, "login")}
                  value={loginInput.password}
                  required
                />
              </div> 

              <div className="space-y-1">
  <Label>Role</Label>
  <div className="flex gap-4">
    <label className="flex items-center gap-1">
      <input
        type="radio"
        name="role"
        value="student"
        checked={loginInput.role === "student"}
        onChange={(e) => eventClickHandler(e, "login")}
      />
      Student
    </label>
    <label className="flex items-center gap-1">
      <input
        type="radio"
        name="role"
        value="instructor"
        checked={loginInput.role === "instructor"}
        onChange={(e) => eventClickHandler(e, "login")}
      />
      Instructor
    </label>
  </div>
</div>

            </CardContent>
            <CardFooter>
              <Button
                className="bg-black text-white"
                disabled={loginIsLoading}
                onClick={() => handleregistration("login")}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
