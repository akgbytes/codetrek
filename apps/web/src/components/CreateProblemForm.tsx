import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import type { Problem } from "@repo/zod";
import {
  Controller,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";

import TextInput from "./ui/TextInput";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Plus, X } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";

const CreateProblemForm = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Problem>({
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      tags: [],
      type: "FREE",
      examples: [{ input: "", output: "", explanation: "" }],
      constraints: [""],
      hints: [""],
      editorial: { approach: "", explanation: "" },
      codeSnippets: [{ language: "PYTHON", snippet: "" }],
      referenceSolutions: [{ language: "PYTHON", solution: "" }],
      testcases: [{ input: "", output: "" }],
    },
  });

  const availableTags = [
    "Array",
    "String",
    "Hash Table",
    "Dynamic Programming",
    "Math",
    "Sorting",
    "Greedy",
    "Depth-First Search",
    "Database",
    "Binary Search",
    "Tree",
    "Breadth-First Search",
    "Matrix",
    "Two Pointers",
    "Binary Tree",
    "Heap",
    "Stack",
    "Graph",
    "Design",
    "Simulation",
    "Backtracking",
    "Linked List",
  ];

  const [newTag, setNewTag] = useState<string>("");

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      const updatedTags = [...tags, tag];
      setValue("tags", updatedTags);
      setNewTag("");
    }
  };

  const tags = useWatch({ name: "tags", control });

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);

    setValue("tags", updatedTags);
  };

  const onSubmit: SubmitHandler<Problem> = async (data) => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold">Create New Problem</h2>

      {/* Basic Information */}
      <Card className="bg-neutral-900 border-white/10 text-zinc-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextInput
            id="title"
            label="Title"
            placeholder="Enter problem title"
            error={errors.title?.message}
            inputProps={register("title", {
              required: "Title is required",
            })}
          />

          <div className="space-y-2">
            <Label htmlFor={"description"} className="text-zinc-50">
              Description
            </Label>
            <div className="flex flex-col">
              <Textarea
                id="description"
                placeholder="Enter problem description"
                className="w-full pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                {...register("description", {
                  required: "Description is required",
                })}
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={"description"} className="text-zinc-50">
              Difficulty
            </Label>

            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[360px] border-white/10 focus-visible:ring-zinc-50 focus-visible:ring-[1px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={"type"} className="text-zinc-50">
              Type
            </Label>

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[360px] border-white/10 focus-visible:ring-zinc-50 focus-visible:ring-[1px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">Free</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                    <SelectItem value="DEMO">Demo</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Select value={newTag} onValueChange={setNewTag}>
                <SelectTrigger className="flex-1 border-white/10 focus-visible:ring-zinc-50 focus-visible:ring-[1px]">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags
                    .filter((tag) => !tags.includes(tag))
                    .map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => addTag(newTag)}
                disabled={!newTag}
                className="cursor-pointer bg-lime-600 hover:bg-lime-600/90 border-0 hover:text-zinc-50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      removeTag(tag);
                    }}
                    className="cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default CreateProblemForm;
