import { describe, expect, it } from "vitest";
import { calculateDailyStats, calculateStatusData } from "../utils";
import { Todo } from "../../interfaces/todo.interface";

describe("Statistics Utils", () => {
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  const mockTodos: Todo[] = [
    {
      _id: 1,
      body: "Task 1",
      completed: true,
      date: currentDate.toISOString().split("T")[0],
      createdAt: currentDate.toISOString(),
      updatedAt: currentDate.toISOString(),
    },
    {
      _id: 2,
      body: "Task 2",
      completed: false,
      date: currentDate.toISOString().split("T")[0],
      createdAt: currentDate.toISOString(),
      updatedAt: currentDate.toISOString(),
    },
    {
      _id: 3,
      body: "Task 3",
      completed: true,
      date: yesterday.toISOString().split("T")[0],
      createdAt: yesterday.toISOString(),
      updatedAt: yesterday.toISOString(),
    },
  ];

  describe("calculateDailyStats", () => {
    it("calculates daily stats correctly", () => {
      const result = calculateDailyStats(mockTodos);

      // Find stats for today and yesterday
      const todayStats = result.find(
        (stat) => stat.date === currentDate.toISOString().split("T")[0]
      );
      const yesterdayStats = result.find(
        (stat) => stat.date === yesterday.toISOString().split("T")[0]
      );

      // Test today's stats
      expect(todayStats).toBeDefined();
      expect(todayStats?.total).toBe(2);
      expect(todayStats?.completed).toBe(1);

      // Test yesterday's stats
      expect(yesterdayStats).toBeDefined();
      expect(yesterdayStats?.total).toBe(1);
      expect(yesterdayStats?.completed).toBe(1);
    });

    it("returns empty array for null todos", () => {
      const result = calculateDailyStats(null as unknown as Todo[]);
      expect(result).toEqual([]);
    });

    it("returns array with 30 days for empty todos array", () => {
      const result = calculateDailyStats([]);
      expect(result.length).toBe(30);

      // Verify each day has default values
      result.forEach((stat) => {
        expect(stat.total).toBe(0);
        expect(stat.completed).toBe(0);
        expect(stat.date).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
      });
    });

    it("sorts results by date in ascending order", () => {
      const result = calculateDailyStats(mockTodos);

      // Check if dates are sorted
      const dates = result.map((stat) => stat.date);
      const sortedDates = [...dates].sort();
      expect(dates).toEqual(sortedDates);
    });
  });

  describe("calculateStatusData", () => {
    it("calculates status data correctly for non-zero values", () => {
      const result = calculateStatusData(5, 3);
      expect(result).toEqual([
        {
          name: "Tasks",
          completed: 3,
          pending: 2,
        },
      ]);
    });

    it("handles zero tasks", () => {
      const result = calculateStatusData(0, 0);
      expect(result).toEqual([
        {
          name: "Tasks",
          completed: 0,
          pending: 0,
        },
      ]);
    });

    it("handles all tasks completed", () => {
      const result = calculateStatusData(5, 5);
      expect(result).toEqual([
        {
          name: "Tasks",
          completed: 5,
          pending: 0,
        },
      ]);
    });

    it("handles no tasks completed", () => {
      const result = calculateStatusData(5, 0);
      expect(result).toEqual([
        {
          name: "Tasks",
          completed: 0,
          pending: 5,
        },
      ]);
    });
  });
});
