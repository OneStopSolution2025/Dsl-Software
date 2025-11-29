import React, { useEffect, useState } from "react";
import { apiService } from "@/services/api.service";
import { extractCategoriesFromFields, getFieldKey } from "@/utils/categoryHelpers";
import { validateImageFile } from "@/utils/fileValidation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { updateImage, removeImage } from "@/store/slices/formSlice";
import { Upload, X, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

const ImageUpload: React.FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [fieldKey: string]: string }>({});

    // key = ORIGINAL FIELD KEY from API (e.g. INSURED_NRIC_BACK)
    const [categoryFiles, setCategoryFiles] = useState<{
        [fieldKey: string]: { file: File | null; base64: string };
    }>({});
    // { CategoryName: [DisplayFieldName, ...] }
    const [categories, setCategories] = useState<{ [category: string]: string[] }>({});
    // original API fields list – used by getFieldKey
    const [allFields, setAllFields] = useState<string[]>([]);
    // dropdown open/close state
    const [expandedCategories, setExpandedCategories] = useState<{ [category: string]: boolean }>({});

    const { images } = useSelector((state: RootState) => state.form);

    useEffect(() => {
        const fetchMapping = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await apiService.imageMapping.getImageMapping(); // string[]
                setAllFields(data);

                // build dynamic categories + display field names
                const cats = extractCategoriesFromFields(data);
                setCategories(cats);

                const firstCat = Object.keys(cats)[0] || "";

                // init file state for ALL original fields
                const filesObj: { [fieldKey: string]: { file: File | null; base64: string } } = {};
                data.forEach((fieldKey) => {
                    // Check if image already exists in Redux store
                    filesObj[fieldKey] = { 
                        file: null, 
                        base64: images[fieldKey] || "" 
                    };
                });
                setCategoryFiles(filesObj);

                // init dropdown: first category opened
                const expanded: { [category: string]: boolean } = {};
                Object.keys(cats).forEach((cat) => {
                    expanded[cat] = cat === firstCat;
                });
                setExpandedCategories(expanded);
            } catch (e) {
                setError("Failed to load image mapping fields.");
            } finally {
                setLoading(false);
            }
        };

        fetchMapping();
    }, []);

    const toggleCategory = (cat: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [cat]: !prev[cat],
        }));
    };

    const handleFileChange = (fieldKey: string, file: File | null) => {
        if (!fieldKey) return;

        if (!file) {
            setCategoryFiles((prev) => ({
                ...prev,
                [fieldKey]: { file: null, base64: "" },
            }));
            setFieldErrors((prev) => {
                const updated = { ...prev };
                delete updated[fieldKey];
                return updated;
            });
            // Remove from Redux store
            dispatch(removeImage(fieldKey));
            return;
        }

        const validation = validateImageFile(file);
        if (!validation.valid) {
            setFieldErrors((prev) => ({
                ...prev,
                [fieldKey]: validation.error || "Invalid file.",
            }));
            setCategoryFiles((prev) => ({
                ...prev,
                [fieldKey]: { file: null, base64: "" },
            }));
            return;
        }

        setFieldErrors((prev) => {
            const updated = { ...prev };
            delete updated[fieldKey];
            return updated;
        });

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setCategoryFiles((prev) => ({
                ...prev,
                [fieldKey]: { file, base64 },
            }));
            // Update Redux store
            dispatch(updateImage({ fieldKey, base64 }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="w-full space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Upload Missing Images</h3>
                <p className="text-sm text-neutral-600">
                    Upload images for each required field. Click "Save Changes" at the bottom to save all your edits including images.
                </p>
            </div>

            {loading && (
                <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                    <span className="text-sm font-medium text-blue-700">Loading image fields...</span>
                </div>
            )}

            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-red-800 mb-1">Error Loading Fields</h4>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* ACCORDION FOR EACH CATEGORY */}
            <div className="space-y-3">
                {Object.keys(categories).map((cat) => {
                    const isOpen = expandedCategories[cat];
                    const displayFields = categories[cat] || [];

                    const categoryHasErrors = displayFields.some((displayField) => {
                        const key = getFieldKey(cat, displayField, allFields);
                        return key && fieldErrors[key];
                    });

                    const uploadedCount = displayFields.filter((displayField) => {
                        const key = getFieldKey(cat, displayField, allFields);
                        return key && categoryFiles[key]?.base64;
                    }).length;

                    return (
                        <div key={cat} className="border border-neutral-200 rounded-lg bg-white overflow-hidden">
                            {/* Header */}
                            <button
                                type="button"
                                onClick={() => toggleCategory(cat)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-base font-semibold text-neutral-900">{cat}</span>
                                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                                        {uploadedCount}/{displayFields.length}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {uploadedCount === displayFields.length && displayFields.length > 0 && (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    )}
                                    {categoryHasErrors && (
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    )}
                                    {expandedCategories[cat] ? (
                                        <ChevronUp className="h-5 w-5 text-neutral-500" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-neutral-500" />
                                    )}
                                </div>
                            </button>

                            {isOpen && (
                                <div className="px-4 pb-4 pt-2 bg-neutral-50/50">
                                    {/* category-level error list */}
                                    {categoryHasErrors && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertCircle className="h-4 w-4 text-red-600" />
                                                <span className="text-sm font-semibold text-red-800">Validation Errors</span>
                                            </div>
                                            <ul className="space-y-1 ml-6">
                                                {displayFields.map((displayField) => {
                                                    const key = getFieldKey(cat, displayField, allFields);
                                                    if (!key || !fieldErrors[key]) return null;
                                                    return (
                                                        <li key={key} className="text-sm text-red-700">
                                                            <span className="font-medium">{displayField}:</span> {fieldErrors[key]}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Upload boxes grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {displayFields.map((displayField) => {
                                            const fieldKey = getFieldKey(cat, displayField, allFields);
                                            if (!fieldKey) return null;

                                            const fileState = categoryFiles[fieldKey];
                                            const hasError = fieldErrors[fieldKey];

                                            return (
                                                <div
                                                    key={fieldKey}
                                                    className="group relative bg-white rounded-lg border border-neutral-200 overflow-hidden hover:border-primary-300 transition-colors"
                                                >
                                                    {/* Field label */}
                                                    <div className="px-3 py-2 bg-neutral-100 border-b border-neutral-200">
                                                        <p className="text-xs font-semibold text-neutral-700 line-clamp-1" title={displayField}>
                                                            {displayField}
                                                        </p>
                                                    </div>

                                                    {/* Upload area */}
                                                    <label className="block cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept="image/svg+xml,image/png,image/jpeg"
                                                            className="hidden"
                                                            onChange={(e) =>
                                                                handleFileChange(
                                                                    fieldKey,
                                                                    e.target.files ? e.target.files[0] : null
                                                                )
                                                            }
                                                        />
                                                        
                                                        {!fileState?.base64 ? (
                                                            <div className={`h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-b-lg transition-all ${
                                                                hasError 
                                                                    ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                                                                    : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50'
                                                            }`}>
                                                                <Upload className={`h-8 w-8 mb-2 ${hasError ? 'text-red-400' : 'text-neutral-400 group-hover:text-primary-500'}`} />
                                                                <span className="text-xs text-neutral-500 text-center px-2">
                                                                    Click to upload
                                                                </span>
                                                                <span className="text-xs text-neutral-400 mt-1">
                                                                    SVG, PNG, JPG
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="relative h-32 bg-neutral-100">
                                                                <img
                                                                    src={fileState.base64}
                                                                    alt={displayField}
                                                                    className="w-full h-full object-contain p-2"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleFileChange(fieldKey, null);
                                                                    }}
                                                                    className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </label>

                                                    {/* Status indicator */}
                                                    {fileState?.base64 && !hasError && (
                                                        <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ImageUpload;
