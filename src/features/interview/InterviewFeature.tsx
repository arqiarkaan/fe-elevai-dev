import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, ArrowRight, ArrowLeft, Upload, Flag, Briefcase } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const InterviewFeature = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nama: "",
    cvFile: null as File | null,
    jenisInterview: "" as "" | "beasiswa" | "magang",
    bahasa: "",
    namaBeasiswa: "",
    posisiMagang: ""
  });

  const isStep1Valid = formData.nama.trim() !== "";
  const isStep2Valid = formData.jenisInterview && (
    (formData.jenisInterview === "beasiswa" && formData.bahasa && formData.namaBeasiswa) ||
    (formData.jenisInterview === "magang" && formData.posisiMagang)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {step === 1 && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">Siapa Nama Panggilan Anda?</h2>
          </div>
          <p className="text-muted-foreground">Nama ini akan digunakan oleh AI selama sesi interview.</p>

          <Input 
            placeholder="Contoh: Budi"
            value={formData.nama}
            onChange={(e) => setFormData({...formData, nama: e.target.value})}
            className="text-lg"
          />

          <Button 
            className="w-full" 
            size="lg"
            disabled={!isStep1Valid}
            onClick={() => setStep(2)}
          >
            Lanjut
            <ArrowRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">Pengaturan Sesi</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload CV (Opsional)
              </Label>
              <div 
                className="border-2 border-dashed border-border rounded-md p-6 text-center hover:border-primary/50 transition-smooth cursor-pointer"
                onClick={() => document.getElementById('cv-upload')?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {formData.cvFile ? formData.cvFile.name : "Pilih File PDF/DOC..."}
                </p>
                <input 
                  id="cv-upload"
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setFormData({...formData, cvFile: e.target.files?.[0] || null})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Jenis Interview</Label>
              <div className="grid grid-cols-2 gap-0 border border-border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, jenisInterview: "beasiswa", posisiMagang: ""})}
                  className={`py-3 px-4 transition-smooth ${
                    formData.jenisInterview === "beasiswa" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-card hover:bg-muted/50"
                  }`}
                >
                  Beasiswa
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, jenisInterview: "magang", bahasa: "", namaBeasiswa: ""})}
                  className={`py-3 px-4 border-l border-border transition-smooth ${
                    formData.jenisInterview === "magang" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-card hover:bg-muted/50"
                  }`}
                >
                  Magang
                </button>
              </div>
            </div>

            {formData.jenisInterview === "beasiswa" && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Bahasa
                  </Label>
                  <Select value={formData.bahasa} onValueChange={(value) => setFormData({...formData, bahasa: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Bahasa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indonesia">🇮🇩 Indonesia</SelectItem>
                      <SelectItem value="english">🇬🇧 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nama Beasiswa</Label>
                  <Input 
                    placeholder="Masukkan nama beasiswa"
                    value={formData.namaBeasiswa}
                    onChange={(e) => setFormData({...formData, namaBeasiswa: e.target.value})}
                  />
                </div>
              </div>
            )}

            {formData.jenisInterview === "magang" && (
              <div className="space-y-2 animate-fade-in">
                <Label>Posisi Magang</Label>
                <Input 
                  placeholder="Contoh: Software Engineer"
                  value={formData.posisiMagang}
                  onChange={(e) => setFormData({...formData, posisiMagang: e.target.value})}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
            <Button 
              className="flex-1" 
              size="lg"
              disabled={!isStep2Valid}
            >
              Mulai Interview
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
