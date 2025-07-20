import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import clsx from "clsx";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import CreateProblemForm from "../../components/CreateProblemForm";

const Problems = () => {
  const data = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "EASY",
      tags: ["Array", "Hash Table"],
      type: "FREE",
      submissions: 1250,
      acceptance: "49.2%",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Add Two Numbers",
      difficulty: "MEDIUM",
      tags: ["Linked List", "Math"],
      type: "DEMO",
      submissions: 890,
      acceptance: "37.8%",
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      title: "Median of Two Sorted Arrays",
      difficulty: "HARD",
      tags: ["Array", "Binary Search", "Test1", "Test2"],
      type: "PREMIUM",
      submissions: 420,
      acceptance: "35.3%",
      createdAt: "2024-01-13",
    },
  ];

  const headRow = [
    "ID",
    "Title",
    "Difficulty",
    "Tags",
    "Types",
    "Submissions",
    "Acceptance",
    "Created",
    "Action",
  ];

  return (
    <div className="w-full h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl">Problem Management</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer py-5 rounded-[4px] bg-lime-600 hover:bg-lime-600/90">
              <Plus className="w-4 h-4" />
              Create Problem
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Create New Problem
              </DialogTitle>
            </DialogHeader>
            <CreateProblemForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-4 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-8 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
            type="search"
            placeholder="Search problems by title or tags..."
          />
        </div>
      </div>

      {/* Main */}
      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/15">
              {headRow.map((item) => (
                <TableHead className="text-neutral-400/90">{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((problem) => (
              <TableRow className="hover:bg-transparent border-white/15">
                <TableCell className="font-medium">{problem.id}</TableCell>
                <TableCell>{problem.title}</TableCell>
                <TableCell>
                  <Badge
                    className={clsx({
                      "text-lime-400 border-lime-400/20 bg-lime-400/10":
                        problem.difficulty == "EASY",
                      "text-yellow-400 border-yellow-400/20 bg-yellow-400/10":
                        problem.difficulty == "MEDIUM",
                      "text-red-400 border-red-400/20 bg-red-400/10":
                        problem.difficulty == "HARD",
                    })}
                  >
                    {problem.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  {problem.tags.slice(0, 2).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs ml-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {problem.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs ml-1">
                      +{problem.tags.length - 2}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    className={clsx({
                      "text-zinc-50 border-zinc-50/20 bg-zinc-50/10":
                        problem.type == "FREE",
                      "text-yellow-400 border-yellow-400/20 bg-yellow-400/10":
                        problem.type == "PREMIUM",

                      "text-blue-600 border-blue-600/20 bg-blue-600/10":
                        problem.type == "DEMO",
                    })}
                  >
                    {problem.type}
                  </Badge>
                </TableCell>
                <TableCell>{problem.submissions}</TableCell>
                <TableCell>{problem.acceptance}</TableCell>
                <TableCell>{problem.createdAt}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {}}
                      className="cursor-pointer hover:bg-neutral-800 hover:text-zinc-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {}}
                      className="cursor-pointer hover:bg-neutral-800 hover:text-zinc-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {}}
                      className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-neutral-800 "
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Problems;
