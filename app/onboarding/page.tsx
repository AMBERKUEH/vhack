"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Profile = {
  id: string;
  name: string;
  type: string;
  location: string;
  employees: number;
  channels: string[];
  product_type: string;
};

export default function OnboardingPage(): JSX.Element {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("cc_profile") ?? localStorage.getItem("cc_business");
    if (raw) {
      setProfile(JSON.parse(raw) as Profile);
    }
  }, []);

  const update = (key: keyof Profile, value: string): void => {
    if (!profile) return;
    setProfile({ ...profile, [key]: key === "employees" ? Number(value) : value } as Profile);
  };

  const confirm = (): void => {
    if (!profile) return;
    localStorage.setItem("cc_profile", JSON.stringify(profile));
    router.push("/dashboard");
  };

  if (!profile) {
    return <main className="p-8">Loading profile...</main>;
  }

  return (
    <main className="mx-auto max-w-4xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Is this correct?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!edit ? (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{profile.type}</Badge>
              <Badge>{profile.location}</Badge>
              <Badge variant="outline">{profile.employees} employees</Badge>
              {(profile.channels ?? []).map((channel) => (
                <Badge key={channel} variant="secondary">{channel}</Badge>
              ))}
              <Badge>{profile.product_type}</Badge>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <Input value={profile.name} onChange={(e) => update("name", e.target.value)} />
              <Input value={profile.type} onChange={(e) => update("type", e.target.value)} />
              <Input value={profile.location} onChange={(e) => update("location", e.target.value)} />
              <Input value={String(profile.employees)} onChange={(e) => update("employees", e.target.value)} />
              <Input value={profile.product_type} onChange={(e) => update("product_type", e.target.value)} />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={confirm}>Yes, looks right {">"}</Button>
            <Button variant="outline" onClick={() => setEdit((v) => !v)}>{edit ? "Save" : "Edit"}</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}