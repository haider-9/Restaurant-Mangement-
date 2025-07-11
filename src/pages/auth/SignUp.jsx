import CommonForm from "../../components/common/form"
// import { useToast } from "../../components/ui/use-toast";
import { signupFormControls } from "../../features/index";
// import { login } from "../../store/slices/auth/authSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../store/slices/auth/authSlice";
import { useToast } from "../../components/common/toast/useToast";

const initialState = {
  email: "",
  password: "",
  checkedPrivacyPolicy: false
};

function SignUp() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth)
  const { toast } = useToast();

  async function onSubmit(event) {
    // event.preventDefault();
    const response = await dispatch(signUp(formData));
    console.log('response', response.payload.success === false)
    if (response.payload?.success === true) {
      toast({
        title: response.payload?.message,
        variant: "success",
      });
      navigate('/')
    } else {
      console.log('else')
      toast({
        title: response.payload?.message,
        variant: "destructive",
      });
    }

  }

  return (
    <div className="mx-auto h-[95vh] mt-5 w-full max-w-md px-10
        sm:max-w-3xl space-y-6 grid gap-4 grid-cols-1 sm:grid-cols-2
        md:max-w-6xl md:gap-10 md:mt-0 
        lg:max-w-7xl">
      <div className="md:mt-10">
        <div className="text-center flex flex-col gap-1">
          <h1 className="text-[18px] md:text-[25px] font-medium font-poppins tracking-tight text-foreground">
            Get Started Now
          </h1>
          <p className="text-[10px] md:text-[16px] font-poppins">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Google auth */}
        <div className="w-full flex justify-center mt-10">
          <button className="flex gap-2 hover:cursor-pointer items-center p-2.5 rounded-2xl border border-[#8E8C8C]">
            <div className="">
              <img
                className="h-5 w-5"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyAzgLs4C8wzj7OXS5I4e2r_ZGarlAlq5_xA&s"
                alt="google"
              />
            </div>
            <div className="text-[11px] md:text-[13px] font-inter"> Signup with Google</div>
          </button>
        </div>

        <div className="m-2 text-[#8E8C8C] text-[15px]">
          <span>- OR -</span>
        </div>

        <CommonForm
          formControls={signupFormControls}
          buttonText={"Sign Up"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          loading={loading}
        />

        <div className="flex justify-start mt-2">
          <p className="font-inter text-[#515151] text-[12px] md:text-[14px]">Already have an account? <Link to={"/auth/login"} className="text-primary cursor-pointer">Sign In</Link></p>

        </div>
      </div>

      <div className={`hidden 
        sm:flex bg-primary rounded-2xl max-h-5/6 text-white font-inter items-center justify-center flex-col grow gap-10
        md:max-h-[95%]`}>
        <p className="text-xl md:text-[26px] md:w-lg">The Simplest way to manage your Restaurant</p>
        <div>
          <img src="https://assets.justinmind.com/wp-content/uploads/2020/02/dashboard-design-example-hcare.png" alt="" className="h-[90%]" />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
