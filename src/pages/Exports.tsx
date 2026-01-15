import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileSpreadsheet, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface ExportFile {
  name: string;
  created_at: string;
}

const Exports = () => {
  const [files, setFiles] = useState<ExportFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchExports = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from("data-exports")
      .list("", { sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      toast.error("Failed to load exports");
      console.error(error);
    } else {
      setFiles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExports();
  }, []);

  const handleDownload = async (filename: string) => {
    setDownloading(filename);
    try {
      const { data, error } = await supabase.storage
        .from("data-exports")
        .createSignedUrl(filename, 60);

      if (error) throw error;

      const link = document.createElement("a");
      link.href = data.signedUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download file");
    }
    setDownloading(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Data Exports</h1>
          <Button variant="outline" size="sm" onClick={fetchExports} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading exports...</div>
        ) : files.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No exports available yet. Exports are generated weekly.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <Card key={file.name}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(file.created_at), "PPP 'at' p")}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(file.name)}
                    disabled={downloading === file.name}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloading === file.name ? "Downloading..." : "Download"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Exports;
