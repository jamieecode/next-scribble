"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";

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
import { useSearchParams } from "next/navigation";
import { reviewsSchema } from "@/types/reviews-schema";
import { Textarea } from "../ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { addReview } from "@/server/actions/add-review";

export default function ReviewsForm() {
  const params = useSearchParams();
  const productID = Number(params.get("productID"));

  const form = useForm<z.infer<typeof reviewsSchema>>({
    resolver: zodResolver(reviewsSchema),
    defaultValues: {
      productID,
      rating: 0,
      comment: "",
    },
  });

  const { execute, status } = useAction(addReview, {
    onSuccess: (data) => {
      if (data.data?.error) {
        toast.error(data.data?.error);
      }
      if (data.data?.success) {
        toast.success("Review Added");
        form.reset();
      }
    },
  });

  function onSubmit(values: z.infer<typeof reviewsSchema>) {
    execute({
      productID,
      rating: values.rating,
      comment: values.comment,
    });
  }

  return (
    <Popover>
      <PopoverTrigger>
        <div className="w-full">
          <Button className="font-medium w-full" variant={"secondary"}>
            Leave a review
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your review</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="How would you describe this product?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your rating</FormLabel>
                  <FormControl>
                    <Input {...field} type="hidden" placeholder="Star Rating" />
                  </FormControl>

                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((value) => {
                      return (
                        <motion.div
                          className="relative cursor-pointer"
                          key={value}
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <Star
                            key={value}
                            onClick={() => {
                              form.setValue("rating", value, {
                                shouldValidate: true,
                              });
                            }}
                            className={cn(
                              "text-primary bg-transparent transition-all duration-300 ease-in-out",

                              form.getValues("rating") >= value
                                ? "fill-primary"
                                : "fill-muted"
                            )}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />

            <Button
              disabled={status === "executing"}
              className="w-full"
              type="submit"
            >
              {status === "executing" ? "Adding Review..." : "Add Review"}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
