
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoanApplication } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface LoanApplicationFormProps {
  onSubmit: (data: LoanApplication) => void;
  isLoading: boolean;
}

const formSchema = z.object({
  income: z.coerce
    .number()
    .positive("Income must be greater than 0")
    .min(10000, "Income seems too low"),
  loan_amount: z.coerce
    .number()
    .positive("Loan amount must be greater than 0")
    .max(1000000, "Loan amount must be less than 1,000,000"),
  loan_int_rate: z.coerce
    .number()
    .min(5, "Loan Interest Rate must be at least 300")
    .max(20, "Loan Interest Rate must be at most 850"),
  age: z.coerce
    .number()
    .int("Age must be a whole number")
    .min(18, "Applicant must be at least 18 years old")
    .max(120, "Please enter a valid age"),
  previous_defaults: z.enum(["yes", "no"], {
    required_error: "Please select if you have previous defaults",
  }),
  home_ownership: z.enum(["rent", "own", "mortgage", "other"], {
    required_error: "Please select your home ownership status",
  }),
});

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: undefined,
      loan_amount: undefined,
      loan_int_rate: undefined,
      age: undefined,
      previous_defaults: undefined,
      home_ownership: undefined,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values as LoanApplication);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Application Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 75000"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your yearly income before taxes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loan_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 25000"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Amount you want to borrow
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loan_int_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Interest Rate</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 5"
                        min={5}
                        max={20}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Score between 300-850</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 35"
                        min={18}
                        max={120}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Your current age</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="previous_defaults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Loan Defaults</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Have you defaulted on previous loans?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="home_ownership"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Ownership</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="own">Own</SelectItem>
                        <SelectItem value="mortgage">Mortgage</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Your home ownership status</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex justify-center space-x-1">
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                </div>
              ) : (
                "Check Loan Eligibility"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoanApplicationForm;
