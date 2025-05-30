
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image, X } from "lucide-react";

interface BackgroundImageUploaderProps {
  onImageChange: (image: string) => void;
  currentImage: string;
}

const BackgroundImageUploader = ({ onImageChange, currentImage }: BackgroundImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Image className="h-5 w-5 text-blue-500" />
          Background Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentImage ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Label htmlFor="image-upload" className="cursor-pointer">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload an image or drag and drop
              </span>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </Label>
            {isUploading && (
              <p className="text-sm text-blue-500 mt-2">Uploading...</p>
            )}
          </div>
        ) : (
          <div className="relative">
            <img
              src={currentImage}
              alt="Background preview"
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackgroundImageUploader;
