export function load( dataURL: string ): any;
export function dump( exifObject: any ): string;
export function insert( exifData: string, jpegData: string ): string;
export function remove( jpegData: string ): string;

export default _default = {
  /**
   * Get exif data as object.
   * @param dataURL base64 Data Url or "\xff\xd8", or "Exif".
   */
  load,
  /**
   * Get exif as string to insert into JPEG.
   * @param exifObject exif object
   */
  dump,
  /**
   * Insert exif into JPEG.
   * @param exifData data to pass as a string, use `dump` to convert object to string.
   * @param jpegData can be dataURL or binaryString.
   * @returns same type as pass to `jpegData`, dataURL or binaryString.
   */
  insert,
  /**
   * Remove exif from JPEG.
   * @param jpegData can be dataURL or binaryString.
   * @returns same type as pass to `jpegData`, dataURL or binaryString.
   */
  remove
};
