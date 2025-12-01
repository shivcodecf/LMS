import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1 className="text-red-500">Failed to get purchased course</h1>;

  const { purchasedCourse = [] } = data || {};

  // guard: if no data, show empty state
  if (!Array.isArray(purchasedCourse) || purchasedCourse.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
          <p className="text-gray-600">No purchased courses found.</p>
        </div>
      </div>
    );
  }

  // build chart data (defensive)
  const courseData = purchasedCourse.map((course) => ({
    name: course?.courseId?.courseTitle || "Untitled",
    price: Number(course?.courseId?.coursePrice) || 0,
  }));

  const totalRevenue = purchasedCourse.reduce((acc, element) => acc + (element.amount || 0), 0);
  const totalSales = purchasedCourse.length;

  // keep X axis labels short on small screens
  const shortLabel = (label, max = 12) =>
    typeof label === "string" && label.length > max ? label.slice(0, max - 1) + "…" : label;

  return (
    <div className="p-6 w-full box-border">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      {/* Grid: 1 col on xs, 2 on sm, 3 on md, 4 on lg */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">₹{totalRevenue}</p>
          </CardContent>
        </Card>

        {/* Spacer cards to keep grid consistent on small screens (optional) */}
        <div className="hidden md:block" />
        <div className="hidden lg:block" />
      </div>

      {/* Course Prices chart: span full width (use grid utilities via wrapper) */}
      <div className="mt-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">Course Prices</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Chart wrapper: keeps chart responsive and allows horizontal scrolling if needed */}
            <div className="w-full min-w-0">
              {/* ResponsiveContainer makes Recharts scale to available width */}
              <div className="w-full h-64 sm:h-72 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={courseData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      interval={0}
                      tickFormatter={(label) => shortLabel(label, 15)} // shorten labels for readability
                      height={60} // ensures rotated labels don't overlap the chart
                      angle={-30}
                      textAnchor="end"
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip formatter={(value) => [`₹${value}`, "Price"]} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#4a90e2"
                      strokeWidth={3}
                      dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
