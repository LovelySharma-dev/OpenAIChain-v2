import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

export function AuthModal({ open, onClose, defaultMode = "login" }: AuthModalProps) {
  const { logout } = useAuth();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-purple-950 via-blue-950 to-purple-950 border-purple-500/30 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-100">Guest Mode</DialogTitle>
          <DialogDescription className="text-gray-400">Authentication is disabled for the hackathon demo. Continue as a guest to train models immediately.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <Button onClick={() => { logout(); onClose(); }} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 shadow-lg shadow-purple-500/20">
            Continue as Guest
          </Button>

          <div className="text-sm text-gray-400 text-center">
            <p>If you need a demo JWT for user-specific flows, POST to <code className="bg-gray-900 px-2 py-1 rounded">/api/auth/google</code> with <code>{"{ "email": "you@example.com", "name": "Demo" }"}</code> (dev only).</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

