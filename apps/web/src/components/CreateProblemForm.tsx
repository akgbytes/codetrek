import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import type { Problem } from "@repo/zod";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";

import { availableTags, languages } from "../constants/problem";
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
import { Minus, Plus, X } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { Input } from "@repo/ui/components/input";

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

  const [newTag, setNewTag] = useState<string>("");

  const tags = useWatch({ name: "tags", control });
  const hints = useWatch({ name: "hints", control });
  const constraints = useWatch({ name: "constraints", control });

  // Tags
  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      const updatedTags = [...tags, tag];
      setValue("tags", updatedTags);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);

    setValue("tags", updatedTags);
  };

  // Hints
  const addHint = () => {
    setValue("hints", [...hints, ""]);
  };

  const removeHint = (index: number) => {
    const updated = hints.filter((_, i) => i !== index);
    setValue("hints", updated);
  };

  const updateHint = (index: number, value: string) => {
    const updated = [...hints];
    updated[index] = value;
    setValue("hints", updated);
  };

  // Constraints
  const addConstraint = () => {
    setValue("constraints", [...constraints, ""]);
  };

  const removeConstraint = (index: number) => {
    const updated = constraints.filter((_, i) => i !== index);
    setValue("constraints", updated);
  };

  const updateConstraint = (index: number, value: string) => {
    const updated = [...constraints];
    updated[index] = value;
    setValue("constraints", updated);
  };

  const {
    fields: examples,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({
    control,
    name: "examples",
  });

  const {
    fields: codeSnippets,
    append: appendCodeSnippet,
    remove: removeCodeSnippet,
  } = useFieldArray({
    control,
    name: "codeSnippets",
  });

  const {
    fields: referenceSolutions,
    append: appendReferenceSolution,
    remove: removeReferenceSolution,
  } = useFieldArray({
    control,
    name: "referenceSolutions",
  });

  const {
    fields: testcases,
    append: appendTestcase,
    remove: removeTestcase,
  } = useFieldArray({
    control,
    name: "testcases",
  });

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
                onClick={() => addTag(newTag)}
                disabled={!newTag}
                className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
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

      {/* Examples */}
      <Card className="bg-neutral-900 border-white/10 text-zinc-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Examples</CardTitle>
            <Button
              type="button"
              onClick={() =>
                appendExample({ input: "", output: "", explanation: "" })
              }
              className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Example
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {examples.map((field, index) => (
            <div
              key={field.id}
              className="border rounded border-white/10 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Example {index + 1}</h4>
                {examples.length > 1 && (
                  <Button
                    type="button"
                    className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
                    onClick={() => removeExample(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`example-input-${index + 1}`}>Input</Label>
                  <Textarea
                    id={`example-input-${index + 1}`}
                    placeholder="Enter input"
                    className="w-full pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                    {...register(`examples.${index}.input`)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`example-output-${index + 1}`}>Output</Label>
                  <Textarea
                    id={`example-output-${index + 1}`}
                    placeholder="Enter output"
                    className="w-full pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                    {...register(`examples.${index}.output`)}
                    rows={3}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`example-explain-${index + 1}`}>
                  Explanation
                </Label>
                <Textarea
                  id={`example-explain-${index + 1}`}
                  placeholder="Enter explanation"
                  className="w-full pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                  {...register(`examples.${index}.explanation`)}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Constraints */}
      <Card className="bg-neutral-900 border-white/10 text-zinc-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Constraints</CardTitle>
            <Button
              type="button"
              onClick={addConstraint}
              className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Constraints
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {constraints.map((constraint, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={constraint}
                onChange={(e) => updateConstraint(index, e.target.value)}
                placeholder="Enter constraint"
                className="w-full pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
              />

              {constraints.length > 1 && (
                <Button
                  type="button"
                  className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
                  onClick={() => removeConstraint(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hints */}
      <Card className="bg-neutral-900 border-white/10 text-zinc-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Hints</CardTitle>
            <Button
              type="button"
              onClick={addHint}
              className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Hints
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {hints.map((hint, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={hint}
                onChange={(e) => updateHint(index, e.target.value)}
                placeholder="Enter hint"
                className="w-full pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
              />

              {constraints.length > 1 && (
                <Button
                  type="button"
                  className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
                  onClick={() => removeHint(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Code Snippets */}
      <Card className="bg-neutral-900 border-white/10 text-zinc-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Code Snippets</CardTitle>
            <Button
              type="button"
              onClick={() =>
                appendCodeSnippet({ language: "PYTHON", snippet: "" })
              }
              className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Snippet
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {codeSnippets.map((snippet, index) => (
            <div
              key={snippet.id}
              className="border rounded border-white/10 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Controller
                  control={control}
                  name={`codeSnippets.${index}.language`}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[360px] border-white/10 focus-visible:ring-zinc-50 focus-visible:ring-[1px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {codeSnippets.length > 1 && (
                  <Button
                    type="button"
                    className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
                    onClick={() => removeCodeSnippet(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <Textarea
                {...register(`codeSnippets.${index}.snippet`)}
                placeholder="Enter code snippet"
                rows={6}
                className="w-full pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reference Solution */}
      <Card className="bg-neutral-900 border-white/10 text-zinc-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Reference Solutions
            </CardTitle>
            <Button
              type="button"
              onClick={() =>
                appendReferenceSolution({ language: "PYTHON", solution: "" })
              }
              className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Solution
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {referenceSolutions.map((solution, index) => (
            <div
              key={solution.id}
              className="border rounded border-white/10 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Controller
                  control={control}
                  name={`referenceSolutions.${index}.language`}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[360px] border-white/10 focus-visible:ring-zinc-50 focus-visible:ring-[1px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {referenceSolutions.length > 1 && (
                  <Button
                    type="button"
                    className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
                    onClick={() => removeReferenceSolution(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <Textarea
                {...register(`referenceSolutions.${index}.solution`)}
                placeholder="Enter reference solution"
                rows={8}
                className="w-full pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* TestCases */}
      <Card className="bg-neutral-900 border-white/10 text-zinc-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Test Cases</CardTitle>
            <Button
              type="button"
              onClick={() => appendTestcase({ input: "", output: "" })}
              className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Test Case
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {testcases.map((testcase, index) => (
            <div
              key={testcase.id}
              className="border rounded border-white/10 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Test Case {index + 1}</h4>
                {testcases.length > 1 && (
                  <Button
                    type="button"
                    className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
                    onClick={() => removeTestcase(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Input</Label>
                  <Textarea
                    {...register(`testcases.${index}.input`)}
                    placeholder="Enter test input"
                    rows={3}
                    className="w-full pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expected Output</Label>
                  <Textarea
                    {...register(`testcases.${index}.output`)}
                    placeholder="Enter expected output"
                    rows={3}
                    className="w-full pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          className="border border-zinc-700 cursor-pointer hover:bg-zinc-800 transition-colors duration-200"
          onClick={() => {}}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-lime-600 hover:bg-lime-600/90 transition-colors duration-200 cursor-pointer"
        >
          Create Problem
        </Button>
      </div>
    </form>
  );
};

export default CreateProblemForm;
