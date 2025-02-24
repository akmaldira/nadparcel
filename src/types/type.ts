import { $Enums, Prisma } from "@prisma/client";

export type ServerActionError = {
  status: "error";
  error: string;
  redirect?: string;
};

export type ServerActionSuccess<T> = {
  status: "success";
  data: T;
  message?: string;
  redirect?: string;
};

export type ServerAction<T> = ServerActionError | ServerActionSuccess<T>;

export type NavItem =
  | {
      type: "item";
      title: string;
      url: string;
      acceptedRoles: $Enums.UserRole[];
      icon: React.ElementType;
    }
  | {
      type: "group";
      title: string;
      url: string;
      icon: React.ElementType;
      isActive: boolean;
      acceptedRoles: $Enums.UserRole[];
      items: { title: string; url: string }[];
    };

export type ItemWithHistories = Prisma.ItemGetPayload<{
  include: {
    histories: true;
  };
}>;
