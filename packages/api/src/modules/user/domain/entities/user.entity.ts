import { Entity } from "../../../../shared/kernel/domain/entity";

export interface UserProps {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {
  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get name(): string {
    return this.props.name;
  }

  get role(): string {
    return this.props.role;
  }

  get image(): string | null {
    return this.props.image ?? null;
  }

  private constructor(props: UserProps) {
    super(props.id, props);
  }

  static create(props: Omit<UserProps, "id" | "createdAt" | "updatedAt">): User {
    return new User({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPrisma(data: unknown): User {
    const d = data as {
      id: string;
      email: string;
      password: string;
      name: string;
      role: string;
      image?: string | null;
      createdAt: Date;
      updatedAt: Date;
    };

    return new User({
      id: d.id,
      email: d.email,
      password: d.password,
      name: d.name,
      role: d.role,
      image: d.image,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    });
  }

  updateProfile(data: { name?: string; image?: string }): void {
    if (data.name) this.props.name = data.name;
    if (data.image !== undefined) this.props.image = data.image;
    this.props.updatedAt = new Date();
  }

  updatePassword(hashedPassword: string): void {
    this.props.password = hashedPassword;
    this.props.updatedAt = new Date();
  }

  toPrisma() {
    return {
      id: this.props.id,
      email: this.props.email,
      password: this.props.password,
      name: this.props.name,
      role: this.props.role,
      image: this.props.image,
    };
  }
}