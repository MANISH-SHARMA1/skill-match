import { NextResponse } from "next/server";

// A utility to standardize API responses
export function success(statusCode: number, result: any) {
  return NextResponse.json({
    status: "ok",
    statusCode,
    result,
  });
}

// A utility to standardize API error responses
export function error(statusCode: number, result: any) {
  return NextResponse.json({
    status: "error",
    statusCode,
    result,
  });
}
