import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const StatCard = ({ label, value }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
