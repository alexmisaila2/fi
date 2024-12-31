import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const AuthForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = isLogin
        ? await login(values.email, values.password)
        : await register(values.email, values.password);

      toast({
        variant: result.success ? "default" : "destructive",
        title: result.message,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isLogin ? "Login to your account" : "Create an account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials below to {isLogin ? "login" : "create your account"}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : isLogin ? "Login" : "Register"}
          </Button>
        </form>
      </Form>
      <Button
        variant="link"
        className="w-full"
        onClick={() => setIsLogin(!isLogin)}
        disabled={isLoading}
      >
        {isLogin ? "Need an account? Register" : "Have an account? Login"}
      </Button>
    </div>
  );
};