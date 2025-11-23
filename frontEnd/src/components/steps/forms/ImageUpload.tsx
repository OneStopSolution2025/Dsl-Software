import React, { useEffect, useState } from "react";
import { apiService } from "@/services/api.service";
import { extractCategoriesFromFields, getFieldKey } from "@/utils/categoryHelpers";
import { validateImageFile } from "@/utils/fileValidation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ImageUpload: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [fieldKey: string]: string }>({});
    const [success, setSuccess] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<string>("");
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

    const { sessionId } = useSelector((state: RootState) => state.session);

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
                setSelectedCategory(firstCat);

                // init file state for ALL original fields
                const filesObj: { [fieldKey: string]: { file: File | null; base64: string } } = {};
                data.forEach((fieldKey) => {
                    filesObj[fieldKey] = { file: null, base64: "" };
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
        setSelectedCategory(cat);
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
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);

        if (!selectedCategory) {
            setError("Please select a category.");
            return;
        }

        // map display fields -> original field keys for this category
        const selectedFieldKeys = (categories[selectedCategory] || [])
            .map((displayField) => getFieldKey(selectedCategory, displayField, allFields))
            .filter((k) => !!k);

        const missing = selectedFieldKeys.filter(
            (key) => !categoryFiles[key]?.file || !categoryFiles[key]?.base64
        );
        const hasFieldErrors = selectedFieldKeys.some((key) => fieldErrors[key]);

        if (missing.length > 0 || hasFieldErrors) {
            setError(
                hasFieldErrors
                    ? "Please fix file type/size errors before uploading."
                    : "Please select a file for each required image in this category."
            );
            return;
        }

        const imagesPayload: { [fieldKey: string]: { base64: string } } = {};
        selectedFieldKeys.forEach((key) => {
            imagesPayload[key] = { base64: categoryFiles[key].base64 };
        });

        const payload = {
            images: imagesPayload,
            text: {},
        };

        try {
            setLoading(true);
            if (sessionId) {
                await apiService.mapReport.uploadMapReport(sessionId, payload);
            }
            setSuccess("Images uploaded successfully!");

            // clear only this category's files
            setCategoryFiles((prev) => {
                const updated = { ...prev };
                selectedFieldKeys.forEach((key) => {
                    updated[key] = { file: null, base64: "" };
                });
                return updated;
            });
        } catch (e) {
            setError("Failed to upload images. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto font-sans">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Upload Missing Images</h2>

            {loading && (
                <div className="mb-4">
                    <span className="text-blue-600 font-medium">Loading...</span>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-400">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 rounded bg-green-100 text-green-700 border border-green-400">
                    {success}
                </div>
            )}

            {/* ACCORDION FOR EACH CATEGORY */}
            <div className="space-y-4">
                {Object.keys(categories).map((cat) => {
                    const isOpen = expandedCategories[cat];
                    const displayFields = categories[cat] || [];

                    const categoryHasErrors = displayFields.some((displayField) => {
                        const key = getFieldKey(cat, displayField, allFields);
                        return key && fieldErrors[key];
                    });

                    return (
                        <div key={cat} className="border rounded-lg bg-white shadow-sm">
                            {/* Header */}
                            <button
                                type="button"
                                onClick={() => toggleCategory(cat)}
                                className="w-full flex items-center justify-between px-4 py-3 text-left"
                            >
                                <span className="font-semibold text-gray-900">{cat}</span>
                                <span className="text-sm text-gray-500">{isOpen ? "▲" : "▼"}</span>
                            </button>

                            {isOpen && (
                                <div className="px-4 pb-4 pt-1">
                                    {/* category-level error list */}
                                    {categoryHasErrors && (
                                        <div className="mb-3 p-3 rounded-lg border border-red-300 bg-red-50">
                                            <div className="font-semibold text-red-700 mb-1">Validation Errors</div>
                                            <ul className="list-disc pl-4 text-sm text-red-700">
                                                {displayFields.map((displayField) => {
                                                    const key = getFieldKey(cat, displayField, allFields);
                                                    if (!key || !fieldErrors[key]) return null;
                                                    return (
                                                        <li key={key}>
                                                            <span className="font-medium">{displayField}:</span>{" "}
                                                            {fieldErrors[key]}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}

                                    {/* smaller drop boxes */}
                                    <div className="flex gap-4 flex-row flex-wrap">
                                        {displayFields.map((displayField) => {
                                            const fieldKey = getFieldKey(cat, displayField, allFields);
                                            if (!fieldKey) return null;

                                            const fileState = categoryFiles[fieldKey];

                                            return (
                                                <div
                                                    key={fieldKey}
                                                    className="bg-white rounded-xl shadow-sm flex flex-col gap-2 border border-gray-200 w-44 min-h-[140px] justify-between"
                                                >
                                                    <div className="font-semibold text-gray-800 text-[11px] uppercase tracking-wide px-3 pt-3 line-clamp-2">
                                                        {displayField}
                                                    </div>

                                                    <label className="w-full cursor-pointer flex-1 flex flex-col justify-center px-3 pb-3">
                                                        <div
                                                            className={`w-full h-20 flex items-center justify-center border-2 border-dashed rounded-lg text-center text-xs transition-colors duration-150 focus-within:ring-2 focus-within:ring-blue-400 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 ${fileState?.file
                                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                                    : "border-gray-300 bg-white text-gray-500"
                                                                }`}
                                                        >
                                                            {fileState?.file?.name ? (
                                                                <span className="px-1 truncate">
                                                                    {fileState.file.name}
                                                                </span>
                                                            ) : (
                                                                <span className="flex flex-col items-center justify-center">
                                                                    <span className="text-2xl mb-0.5">☁️</span>
                                                                    <span>
                                                                        Drag &amp; drop or{" "}
                                                                        <span className="text-blue-600 underline">browse</span>
                                                                    </span>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) =>
                                                                handleFileChange(
                                                                    fieldKey,
                                                                    e.target.files ? e.target.files[0] : null
                                                                )
                                                            }
                                                        />
                                                    </label>

                                                    {fileState?.base64 && (
                                                        <div className="mt-1 w-full flex justify-center pb-2">
                                                            <img
                                                                src={fileState.base64}
                                                                alt="preview"
                                                                className="max-h-16 rounded border border-gray-200 shadow-sm object-contain"
                                                            />
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

            <div className="mt-6 flex justify-end">
                <button
                    className={`px-6 py-2.5 rounded-lg font-bold transition-colors text-base shadow-sm ${loading
                            ? "bg-blue-300 text-white cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    onClick={handleSubmit}
                    disabled={loading}
                    type="button"
                >
                    Upload Images
                </button>
            </div>
        </div>
    );
};

export default ImageUpload;
