import { oxygenClient } from "@/lib/api/client";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const oxygenResponse = await oxygenClient.post("/auth/login", {
      email: body.email,
      password: body.password,
    });

    const data = oxygenResponse.data;

    if (!data.suc) {
      return NextResponse.json(
        {
          suc: false,
          error: data.error ?? "Login failed",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      suc: true,
    });

    response.cookies.set({
      name: "oxygen_token",
      value: data.token,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          suc: false,
          error:
            error.response?.data?.error ??
            "Authentication service unavailable",
        },
        {
          status: error.response?.status ?? 502,
        }
      );
    }

    return NextResponse.json(
      {
        suc: false,
        error: "Unable to authenticate",
      },
      { status: 500 }
    );
  }
}