
import { NextRequest, NextResponse } from "next/server";

const OXYGEN_URL = process.env.NEXT_PUBLIC_OXYGEN_URL!;

async function proxyRequest(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  try {
    const { path } = await context.params;

    // --------------------------------
    // 1. Get user token from cookie
    // --------------------------------

    const token = request.cookies.get("oxygen_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // --------------------------------
    // 2. Construct Oxygen URL
    // --------------------------------

    const oxygenUrl = new URL(
      `${OXYGEN_URL}/${path.join("/")}`
    );

    // Forward query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      oxygenUrl.searchParams.append(key, value);
    });

    // --------------------------------
    // 3. Forward request headers
    // --------------------------------

    const headers = new Headers(request.headers);

    // Don't forward these browser/server-specific headers
    headers.delete("host");
    headers.delete("content-length");

    // --------------------------------
    // 4. Inject user's Oxygen token
    // --------------------------------

    headers.set(
      "Authorization",
      `Bearer ${token}`
    );

    // --------------------------------
    // 5. Forward request to Oxygen
    // --------------------------------

    const response = await fetch(oxygenUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" ||
        request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
    });

    // --------------------------------
    // 6. Return Oxygen response
    // --------------------------------

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

  } catch (error) {
    console.error("Oxygen proxy error:", error);

    return NextResponse.json(
      {
        error: "Unable to communicate with Oxygen",
      },
      {
        status: 502,
      }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;