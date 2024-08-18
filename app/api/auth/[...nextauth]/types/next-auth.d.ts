import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface User {
    id: string;
    role: string; // Add the role field
    // Add any other common fields between User and Vendor if needed
  }
  
  interface Vendor {
    id: string;
    role: string; // Add the role field
    // Add any other fields specific to Vendor
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Add the role field
    } & DefaultSession['user'];
  }
}
