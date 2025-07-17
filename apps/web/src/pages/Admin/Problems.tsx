import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Delete,
  Edit,
  Eye,
  LucideView,
  PlusIcon,
  Search,
  Trash,
  View,
} from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import clsx from "clsx";

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
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl">Problem Management</h1>
        <Button className="cursor-pointer py-5 rounded-[4px] bg-lime-600 hover:bg-lime-600/90">
          <PlusIcon />
          Create Problem
        </Button>
      </div>

      {/* search bar */}
      <div className="mt-4 relative flex items-center">
        <Search className="absolute size-4 left-2 text-zinc-400" />
        <Input
          className="pl-8 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
          type="search"
          placeholder="Search problems by title or tags..."
        />
      </div>

      {/* main */}
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {headRow.map((item) => (
                <TableHead className="text-neutral-400/90">{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((problem) => (
              <TableRow className="hover:bg-transparent">
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
                  <div className="flex gap-3">
                    <Eye size={16} className="cursor-pointer" />
                    <Edit size={16} className="cursor-pointer" />
                    <Trash size={16} className="cursor-pointer" />
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
