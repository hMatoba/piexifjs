import { Types, ITags, ITagValues } from './interfaces';

export const TypeNums: { [key: number]: string } = {
  1: 'Byte',
  2: 'Ascii',
  3: 'Short',
  4: 'Long',
  5: 'Rational',
  7: 'Undefined',
  9: 'SLong',
  10: 'SRational',
};

const ImageTagElement = {
  11: {
    name: 'ProcessingSoftware',
    type: Types.Ascii,
  },
  254: {
    name: 'NewSubfileType',
    type: Types.Long,
  },
  255: {
    name: 'SubfileType',
    type: Types.Short,
  },
  256: {
    name: 'ImageWidth',
    type: Types.Long,
  },
  257: {
    name: 'ImageLength',
    type: Types.Long,
  },
  258: {
    name: 'BitsPerSample',
    type: Types.Short,
  },
  259: {
    name: 'Compression',
    type: Types.Short,
  },
  262: {
    name: 'PhotometricInterpretation',
    type: Types.Short,
  },
  263: {
    name: 'Threshholding',
    type: Types.Short,
  },
  264: {
    name: 'CellWidth',
    type: Types.Short,
  },
  265: {
    name: 'CellLength',
    type: Types.Short,
  },
  266: {
    name: 'FillOrder',
    type: Types.Short,
  },
  269: {
    name: 'DocumentName',
    type: Types.Ascii,
  },
  270: {
    name: 'ImageDescription',
    type: Types.Ascii,
  },
  271: {
    name: 'Make',
    type: Types.Ascii,
  },
  272: {
    name: 'Model',
    type: Types.Ascii,
  },
  273: {
    name: 'StripOffsets',
    type: Types.Long,
  },
  274: {
    name: 'Orientation',
    type: Types.Short,
  },
  277: {
    name: 'SamplesPerPixel',
    type: Types.Short,
  },
  278: {
    name: 'RowsPerStrip',
    type: Types.Long,
  },
  279: {
    name: 'StripByteCounts',
    type: Types.Long,
  },
  282: {
    name: 'XResolution',
    type: Types.Rational,
  },
  283: {
    name: 'YResolution',
    type: Types.Rational,
  },
  284: {
    name: 'PlanarConfiguration',
    type: Types.Short,
  },
  290: {
    name: 'GrayResponseUnit',
    type: Types.Short,
  },
  291: {
    name: 'GrayResponseCurve',
    type: Types.Short,
  },
  292: {
    name: 'T4Options',
    type: Types.Long,
  },
  293: {
    name: 'T6Options',
    type: Types.Long,
  },
  296: {
    name: 'ResolutionUnit',
    type: Types.Short,
  },
  301: {
    name: 'TransferFunction',
    type: Types.Short,
  },
  305: {
    name: 'Software',
    type: Types.Ascii,
  },
  306: {
    name: 'DateTime',
    type: Types.Ascii,
  },
  315: {
    name: 'Artist',
    type: Types.Ascii,
  },
  316: {
    name: 'HostComputer',
    type: Types.Ascii,
  },
  317: {
    name: 'Predictor',
    type: Types.Short,
  },
  318: {
    name: 'WhitePoint',
    type: Types.Rational,
  },
  319: {
    name: 'PrimaryChromaticities',
    type: Types.Rational,
  },
  320: {
    name: 'ColorMap',
    type: Types.Short,
  },
  321: {
    name: 'HalftoneHints',
    type: Types.Short,
  },
  322: {
    name: 'TileWidth',
    type: Types.Short,
  },
  323: {
    name: 'TileLength',
    type: Types.Short,
  },
  324: {
    name: 'TileOffsets',
    type: Types.Short,
  },
  325: {
    name: 'TileByteCounts',
    type: Types.Short,
  },
  330: {
    name: 'SubIFDs',
    type: Types.Long,
  },
  332: {
    name: 'InkSet',
    type: Types.Short,
  },
  333: {
    name: 'InkNames',
    type: Types.Ascii,
  },
  334: {
    name: 'NumberOfInks',
    type: Types.Short,
  },
  336: {
    name: 'DotRange',
    type: Types.Byte,
  },
  337: {
    name: 'TargetPrinter',
    type: Types.Ascii,
  },
  338: {
    name: 'ExtraSamples',
    type: Types.Short,
  },
  339: {
    name: 'SampleFormat',
    type: Types.Short,
  },
  340: {
    name: 'SMinSampleValue',
    type: Types.Short,
  },
  341: {
    name: 'SMaxSampleValue',
    type: Types.Short,
  },
  342: {
    name: 'TransferRange',
    type: Types.Short,
  },
  343: {
    name: 'ClipPath',
    type: Types.Byte,
  },
  344: {
    name: 'XClipPathUnits',
    type: Types.Long,
  },
  345: {
    name: 'YClipPathUnits',
    type: Types.Long,
  },
  346: {
    name: 'Indexed',
    type: Types.Short,
  },
  347: {
    name: 'JPEGTables',
    type: Types.Undefined,
  },
  351: {
    name: 'OPIProxy',
    type: Types.Short,
  },
  512: {
    name: 'JPEGProc',
    type: Types.Long,
  },
  513: {
    name: 'JPEGInterchangeFormat',
    type: Types.Long,
  },
  514: {
    name: 'JPEGInterchangeFormatLength',
    type: Types.Long,
  },
  515: {
    name: 'JPEGRestartInterval',
    type: Types.Short,
  },
  517: {
    name: 'JPEGLosslessPredictors',
    type: Types.Short,
  },
  518: {
    name: 'JPEGPointTransforms',
    type: Types.Short,
  },
  519: {
    name: 'JPEGQTables',
    type: Types.Long,
  },
  520: {
    name: 'JPEGDCTables',
    type: Types.Long,
  },
  521: {
    name: 'JPEGACTables',
    type: Types.Long,
  },
  529: {
    name: 'YCbCrCoefficients',
    type: Types.Rational,
  },
  530: {
    name: 'YCbCrSubSampling',
    type: Types.Short,
  },
  531: {
    name: 'YCbCrPositioning',
    type: Types.Short,
  },
  532: {
    name: 'ReferenceBlackWhite',
    type: Types.Rational,
  },
  700: {
    name: 'XMLPacket',
    type: Types.Byte,
  },
  18246: {
    name: 'Rating',
    type: Types.Short,
  },
  18249: {
    name: 'RatingPercent',
    type: Types.Short,
  },
  32781: {
    name: 'ImageID',
    type: Types.Ascii,
  },
  33421: {
    name: 'CFARepeatPatternDim',
    type: Types.Short,
  },
  33422: {
    name: 'CFAPattern',
    type: Types.Byte,
  },
  33423: {
    name: 'BatteryLevel',
    type: Types.Rational,
  },
  33432: {
    name: 'Copyright',
    type: Types.Ascii,
  },
  33434: {
    name: 'ExposureTime',
    type: Types.Rational,
  },
  34377: {
    name: 'ImageResources',
    type: Types.Byte,
  },
  34665: {
    name: 'ExifTag',
    type: Types.Long,
  },
  34675: {
    name: 'InterColorProfile',
    type: Types.Undefined,
  },
  34853: {
    name: 'GPSTag',
    type: Types.Long,
  },
  34857: {
    name: 'Interlace',
    type: Types.Short,
  },
  34858: {
    name: 'TimeZoneOffset',
    type: Types.Long,
  },
  34859: {
    name: 'SelfTimerMode',
    type: Types.Short,
  },
  37387: {
    name: 'FlashEnergy',
    type: Types.Rational,
  },
  37388: {
    name: 'SpatialFrequencyResponse',
    type: Types.Undefined,
  },
  37389: {
    name: 'Noise',
    type: Types.Undefined,
  },
  37390: {
    name: 'FocalPlaneXResolution',
    type: Types.Rational,
  },
  37391: {
    name: 'FocalPlaneYResolution',
    type: Types.Rational,
  },
  37392: {
    name: 'FocalPlaneResolutionUnit',
    type: Types.Short,
  },
  37393: {
    name: 'ImageNumber',
    type: Types.Long,
  },
  37394: {
    name: 'SecurityClassification',
    type: Types.Ascii,
  },
  37395: {
    name: 'ImageHistory',
    type: Types.Ascii,
  },
  37397: {
    name: 'ExposureIndex',
    type: Types.Rational,
  },
  37398: {
    name: 'TIFFEPStandardID',
    type: Types.Byte,
  },
  37399: {
    name: 'SensingMethod',
    type: Types.Short,
  },
  40091: {
    name: 'XPTitle',
    type: Types.Byte,
  },
  40092: {
    name: 'XPComment',
    type: Types.Byte,
  },
  40093: {
    name: 'XPAuthor',
    type: Types.Byte,
  },
  40094: {
    name: 'XPKeywords',
    type: Types.Byte,
  },
  40095: {
    name: 'XPSubject',
    type: Types.Byte,
  },
  50341: {
    name: 'PrintImageMatching',
    type: Types.Undefined,
  },
  50706: {
    name: 'DNGVersion',
    type: Types.Byte,
  },
  50707: {
    name: 'DNGBackwardVersion',
    type: Types.Byte,
  },
  50708: {
    name: 'UniqueCameraModel',
    type: Types.Ascii,
  },
  50709: {
    name: 'LocalizedCameraModel',
    type: Types.Byte,
  },
  50710: {
    name: 'CFAPlaneColor',
    type: Types.Byte,
  },
  50711: {
    name: 'CFALayout',
    type: Types.Short,
  },
  50712: {
    name: 'LinearizationTable',
    type: Types.Short,
  },
  50713: {
    name: 'BlackLevelRepeatDim',
    type: Types.Short,
  },
  50714: {
    name: 'BlackLevel',
    type: Types.Rational,
  },
  50715: {
    name: 'BlackLevelDeltaH',
    type: Types.SRational,
  },
  50716: {
    name: 'BlackLevelDeltaV',
    type: Types.SRational,
  },
  50717: {
    name: 'WhiteLevel',
    type: Types.Short,
  },
  50718: {
    name: 'DefaultScale',
    type: Types.Rational,
  },
  50719: {
    name: 'DefaultCropOrigin',
    type: Types.Short,
  },
  50720: {
    name: 'DefaultCropSize',
    type: Types.Short,
  },
  50721: {
    name: 'ColorMatrix1',
    type: Types.SRational,
  },
  50722: {
    name: 'ColorMatrix2',
    type: Types.SRational,
  },
  50723: {
    name: 'CameraCalibration1',
    type: Types.SRational,
  },
  50724: {
    name: 'CameraCalibration2',
    type: Types.SRational,
  },
  50725: {
    name: 'ReductionMatrix1',
    type: Types.SRational,
  },
  50726: {
    name: 'ReductionMatrix2',
    type: Types.SRational,
  },
  50727: {
    name: 'AnalogBalance',
    type: Types.Rational,
  },
  50728: {
    name: 'AsShotNeutral',
    type: Types.Short,
  },
  50729: {
    name: 'AsShotWhiteXY',
    type: Types.Rational,
  },
  50730: {
    name: 'BaselineExposure',
    type: Types.SRational,
  },
  50731: {
    name: 'BaselineNoise',
    type: Types.Rational,
  },
  50732: {
    name: 'BaselineSharpness',
    type: Types.Rational,
  },
  50733: {
    name: 'BayerGreenSplit',
    type: Types.Long,
  },
  50734: {
    name: 'LinearResponseLimit',
    type: Types.Rational,
  },
  50735: {
    name: 'CameraSerialNumber',
    type: Types.Ascii,
  },
  50736: {
    name: 'LensInfo',
    type: Types.Rational,
  },
  50737: {
    name: 'ChromaBlurRadius',
    type: Types.Rational,
  },
  50738: {
    name: 'AntiAliasStrength',
    type: Types.Rational,
  },
  50739: {
    name: 'ShadowScale',
    type: Types.SRational,
  },
  50740: {
    name: 'DNGPrivateData',
    type: Types.Byte,
  },
  50741: {
    name: 'MakerNoteSafety',
    type: Types.Short,
  },
  50778: {
    name: 'CalibrationIlluminant1',
    type: Types.Short,
  },
  50779: {
    name: 'CalibrationIlluminant2',
    type: Types.Short,
  },
  50780: {
    name: 'BestQualityScale',
    type: Types.Rational,
  },
  50781: {
    name: 'RawDataUniqueID',
    type: Types.Byte,
  },
  50827: {
    name: 'OriginalRawFileName',
    type: Types.Byte,
  },
  50828: {
    name: 'OriginalRawFileData',
    type: Types.Undefined,
  },
  50829: {
    name: 'ActiveArea',
    type: Types.Short,
  },
  50830: {
    name: 'MaskedAreas',
    type: Types.Short,
  },
  50831: {
    name: 'AsShotICCProfile',
    type: Types.Undefined,
  },
  50832: {
    name: 'AsShotPreProfileMatrix',
    type: Types.SRational,
  },
  50833: {
    name: 'CurrentICCProfile',
    type: Types.Undefined,
  },
  50834: {
    name: 'CurrentPreProfileMatrix',
    type: Types.SRational,
  },
  50879: {
    name: 'ColorimetricReference',
    type: Types.Short,
  },
  50931: {
    name: 'CameraCalibrationSignature',
    type: Types.Byte,
  },
  50932: {
    name: 'ProfileCalibrationSignature',
    type: Types.Byte,
  },
  50934: {
    name: 'AsShotProfileName',
    type: Types.Byte,
  },
  50935: {
    name: 'NoiseReductionApplied',
    type: Types.Rational,
  },
  50936: {
    name: 'ProfileName',
    type: Types.Byte,
  },
  50937: {
    name: 'ProfileHueSatMapDims',
    type: Types.Long,
  },
  50941: {
    name: 'ProfileEmbedPolicy',
    type: Types.Long,
  },
  50942: {
    name: 'ProfileCopyright',
    type: Types.Byte,
  },
  50964: {
    name: 'ForwardMatrix1',
    type: Types.SRational,
  },
  50965: {
    name: 'ForwardMatrix2',
    type: Types.SRational,
  },
  50966: {
    name: 'PreviewApplicationName',
    type: Types.Byte,
  },
  50967: {
    name: 'PreviewApplicationVersion',
    type: Types.Byte,
  },
  50968: {
    name: 'PreviewSettingsName',
    type: Types.Byte,
  },
  50969: {
    name: 'PreviewSettingsDigest',
    type: Types.Byte,
  },
  50970: {
    name: 'PreviewColorSpace',
    type: Types.Long,
  },
  50971: {
    name: 'PreviewDateTime',
    type: Types.Ascii,
  },
  50972: {
    name: 'RawImageDigest',
    type: Types.Undefined,
  },
  50973: {
    name: 'OriginalRawFileDigest',
    type: Types.Undefined,
  },
  50974: {
    name: 'SubTileBlockSize',
    type: Types.Long,
  },
  50975: {
    name: 'RowInterleaveFactor',
    type: Types.Long,
  },
  50981: {
    name: 'ProfileLookTableDims',
    type: Types.Long,
  },
  51008: {
    name: 'OpcodeList1',
    type: Types.Undefined,
  },
  51009: {
    name: 'OpcodeList2',
    type: Types.Undefined,
  },
  51022: {
    name: 'OpcodeList3',
    type: Types.Undefined,
  },
};

export const Tags: ITags = {
  Image: ImageTagElement,
  '0th': ImageTagElement,
  '1st': ImageTagElement,
  Exif: {
    33434: {
      name: 'ExposureTime',
      type: Types.Rational,
    },
    33437: {
      name: 'FNumber',
      type: Types.Rational,
    },
    34850: {
      name: 'ExposureProgram',
      type: Types.Short,
    },
    34852: {
      name: 'SpectralSensitivity',
      type: Types.Ascii,
    },
    34855: {
      name: 'ISOSpeedRatings',
      type: Types.Short,
    },
    34856: {
      name: 'OECF',
      type: Types.Undefined,
    },
    34864: {
      name: 'SensitivityType',
      type: Types.Short,
    },
    34865: {
      name: 'StandardOutputSensitivity',
      type: Types.Long,
    },
    34866: {
      name: 'RecommendedExposureIndex',
      type: Types.Long,
    },
    34867: {
      name: 'ISOSpeed',
      type: Types.Long,
    },
    34868: {
      name: 'ISOSpeedLatitudeyyy',
      type: Types.Long,
    },
    34869: {
      name: 'ISOSpeedLatitudezzz',
      type: Types.Long,
    },
    36864: {
      name: 'ExifVersion',
      type: Types.Undefined,
    },
    36867: {
      name: 'DateTimeOriginal',
      type: Types.Ascii,
    },
    36868: {
      name: 'DateTimeDigitized',
      type: Types.Ascii,
    },
    37121: {
      name: 'ComponentsConfiguration',
      type: Types.Undefined,
    },
    37122: {
      name: 'CompressedBitsPerPixel',
      type: Types.Rational,
    },
    37377: {
      name: 'ShutterSpeedValue',
      type: Types.SRational,
    },
    37378: {
      name: 'ApertureValue',
      type: Types.Rational,
    },
    37379: {
      name: 'BrightnessValue',
      type: Types.SRational,
    },
    37380: {
      name: 'ExposureBiasValue',
      type: Types.SRational,
    },
    37381: {
      name: 'MaxApertureValue',
      type: Types.Rational,
    },
    37382: {
      name: 'SubjectDistance',
      type: Types.Rational,
    },
    37383: {
      name: 'MeteringMode',
      type: Types.Short,
    },
    37384: {
      name: 'LightSource',
      type: Types.Short,
    },
    37385: {
      name: 'Flash',
      type: Types.Short,
    },
    37386: {
      name: 'FocalLength',
      type: Types.Rational,
    },
    37396: {
      name: 'SubjectArea',
      type: Types.Short,
    },
    37500: {
      name: 'MakerNote',
      type: Types.Undefined,
    },
    37510: {
      name: 'UserComment',
      type: Types.Ascii,
    },
    37520: {
      name: 'SubSecTime',
      type: Types.Ascii,
    },
    37521: {
      name: 'SubSecTimeOriginal',
      type: Types.Ascii,
    },
    37522: {
      name: 'SubSecTimeDigitized',
      type: Types.Ascii,
    },
    40960: {
      name: 'FlashpixVersion',
      type: Types.Undefined,
    },
    40961: {
      name: 'ColorSpace',
      type: Types.Short,
    },
    40962: {
      name: 'PixelXDimension',
      type: Types.Long,
    },
    40963: {
      name: 'PixelYDimension',
      type: Types.Long,
    },
    40964: {
      name: 'RelatedSoundFile',
      type: Types.Ascii,
    },
    40965: {
      name: 'InteroperabilityTag',
      type: Types.Long,
    },
    41483: {
      name: 'FlashEnergy',
      type: Types.Rational,
    },
    41484: {
      name: 'SpatialFrequencyResponse',
      type: Types.Undefined,
    },
    41486: {
      name: 'FocalPlaneXResolution',
      type: Types.Rational,
    },
    41487: {
      name: 'FocalPlaneYResolution',
      type: Types.Rational,
    },
    41488: {
      name: 'FocalPlaneResolutionUnit',
      type: Types.Short,
    },
    41492: {
      name: 'SubjectLocation',
      type: Types.Short,
    },
    41493: {
      name: 'ExposureIndex',
      type: Types.Rational,
    },
    41495: {
      name: 'SensingMethod',
      type: Types.Short,
    },
    41728: {
      name: 'FileSource',
      type: Types.Undefined,
    },
    41729: {
      name: 'SceneType',
      type: Types.Undefined,
    },
    41730: {
      name: 'CFAPattern',
      type: Types.Undefined,
    },
    41985: {
      name: 'CustomRendered',
      type: Types.Short,
    },
    41986: {
      name: 'ExposureMode',
      type: Types.Short,
    },
    41987: {
      name: 'WhiteBalance',
      type: Types.Short,
    },
    41988: {
      name: 'DigitalZoomRatio',
      type: Types.Rational,
    },
    41989: {
      name: 'FocalLengthIn35mmFilm',
      type: Types.Short,
    },
    41990: {
      name: 'SceneCaptureType',
      type: Types.Short,
    },
    41991: {
      name: 'GainControl',
      type: Types.Short,
    },
    41992: {
      name: 'Contrast',
      type: Types.Short,
    },
    41993: {
      name: 'Saturation',
      type: Types.Short,
    },
    41994: {
      name: 'Sharpness',
      type: Types.Short,
    },
    41995: {
      name: 'DeviceSettingDescription',
      type: Types.Undefined,
    },
    41996: {
      name: 'SubjectDistanceRange',
      type: Types.Short,
    },
    42016: {
      name: 'ImageUniqueID',
      type: Types.Ascii,
    },
    42032: {
      name: 'CameraOwnerName',
      type: Types.Ascii,
    },
    42033: {
      name: 'BodySerialNumber',
      type: Types.Ascii,
    },
    42034: {
      name: 'LensSpecification',
      type: Types.Rational,
    },
    42035: {
      name: 'LensMake',
      type: Types.Ascii,
    },
    42036: {
      name: 'LensModel',
      type: Types.Ascii,
    },
    42037: {
      name: 'LensSerialNumber',
      type: Types.Ascii,
    },
    42240: {
      name: 'Gamma',
      type: Types.Rational,
    },
  },
  GPS: {
    0: {
      name: 'GPSVersionID',
      type: Types.Byte,
    },
    1: {
      name: 'GPSLatitudeRef',
      type: Types.Ascii,
    },
    2: {
      name: 'GPSLatitude',
      type: Types.Rational,
    },
    3: {
      name: 'GPSLongitudeRef',
      type: Types.Ascii,
    },
    4: {
      name: 'GPSLongitude',
      type: Types.Rational,
    },
    5: {
      name: 'GPSAltitudeRef',
      type: Types.Byte,
    },
    6: {
      name: 'GPSAltitude',
      type: Types.Rational,
    },
    7: {
      name: 'GPSTimeStamp',
      type: Types.Rational,
    },
    8: {
      name: 'GPSSatellites',
      type: Types.Ascii,
    },
    9: {
      name: 'GPSStatus',
      type: Types.Ascii,
    },
    10: {
      name: 'GPSMeasureMode',
      type: Types.Ascii,
    },
    11: {
      name: 'GPSDOP',
      type: Types.Rational,
    },
    12: {
      name: 'GPSSpeedRef',
      type: Types.Ascii,
    },
    13: {
      name: 'GPSSpeed',
      type: Types.Rational,
    },
    14: {
      name: 'GPSTrackRef',
      type: Types.Ascii,
    },
    15: {
      name: 'GPSTrack',
      type: Types.Rational,
    },
    16: {
      name: 'GPSImgDirectionRef',
      type: Types.Ascii,
    },
    17: {
      name: 'GPSImgDirection',
      type: Types.Rational,
    },
    18: {
      name: 'GPSMapDatum',
      type: Types.Ascii,
    },
    19: {
      name: 'GPSDestLatitudeRef',
      type: Types.Ascii,
    },
    20: {
      name: 'GPSDestLatitude',
      type: Types.Rational,
    },
    21: {
      name: 'GPSDestLongitudeRef',
      type: Types.Ascii,
    },
    22: {
      name: 'GPSDestLongitude',
      type: Types.Rational,
    },
    23: {
      name: 'GPSDestBearingRef',
      type: Types.Ascii,
    },
    24: {
      name: 'GPSDestBearing',
      type: Types.Rational,
    },
    25: {
      name: 'GPSDestDistanceRef',
      type: Types.Ascii,
    },
    26: {
      name: 'GPSDestDistance',
      type: Types.Rational,
    },
    27: {
      name: 'GPSProcessingMethod',
      type: Types.Undefined,
    },
    28: {
      name: 'GPSAreaInformation',
      type: Types.Undefined,
    },
    29: {
      name: 'GPSDateStamp',
      type: Types.Ascii,
    },
    30: {
      name: 'GPSDifferential',
      type: Types.Short,
    },
    31: {
      name: 'GPSHPositioningError',
      type: Types.Rational,
    },
  },
  Interop: {
    1: {
      name: 'InteroperabilityIndex',
      type: Types.Ascii,
    },
  },
};

export const TagValues: ITagValues = {
  ImageIFD: {
    ProcessingSoftware: 11,
    NewSubfileType: 254,
    SubfileType: 255,
    ImageWidth: 256,
    ImageLength: 257,
    BitsPerSample: 258,
    Compression: 259,
    PhotometricInterpretation: 262,
    Threshholding: 263,
    CellWidth: 264,
    CellLength: 265,
    FillOrder: 266,
    DocumentName: 269,
    ImageDescription: 270,
    Make: 271,
    Model: 272,
    StripOffsets: 273,
    Orientation: 274,
    SamplesPerPixel: 277,
    RowsPerStrip: 278,
    StripByteCounts: 279,
    XResolution: 282,
    YResolution: 283,
    PlanarConfiguration: 284,
    GrayResponseUnit: 290,
    GrayResponseCurve: 291,
    T4Options: 292,
    T6Options: 293,
    ResolutionUnit: 296,
    TransferFunction: 301,
    Software: 305,
    DateTime: 306,
    Artist: 315,
    HostComputer: 316,
    Predictor: 317,
    WhitePoint: 318,
    PrimaryChromaticities: 319,
    ColorMap: 320,
    HalftoneHints: 321,
    TileWidth: 322,
    TileLength: 323,
    TileOffsets: 324,
    TileByteCounts: 325,
    SubIFDs: 330,
    InkSet: 332,
    InkNames: 333,
    NumberOfInks: 334,
    DotRange: 336,
    TargetPrinter: 337,
    ExtraSamples: 338,
    SampleFormat: 339,
    SMinSampleValue: 340,
    SMaxSampleValue: 341,
    TransferRange: 342,
    ClipPath: 343,
    XClipPathUnits: 344,
    YClipPathUnits: 345,
    Indexed: 346,
    JPEGTables: 347,
    OPIProxy: 351,
    JPEGProc: 512,
    JPEGInterchangeFormat: 513,
    JPEGInterchangeFormatLength: 514,
    JPEGRestartInterval: 515,
    JPEGLosslessPredictors: 517,
    JPEGPointTransforms: 518,
    JPEGQTables: 519,
    JPEGDCTables: 520,
    JPEGACTables: 521,
    YCbCrCoefficients: 529,
    YCbCrSubSampling: 530,
    YCbCrPositioning: 531,
    ReferenceBlackWhite: 532,
    XMLPacket: 700,
    Rating: 18246,
    RatingPercent: 18249,
    ImageID: 32781,
    CFARepeatPatternDim: 33421,
    CFAPattern: 33422,
    BatteryLevel: 33423,
    Copyright: 33432,
    ExposureTime: 33434,
    ImageResources: 34377,
    ExifTag: 34665,
    InterColorProfile: 34675,
    GPSTag: 34853,
    Interlace: 34857,
    TimeZoneOffset: 34858,
    SelfTimerMode: 34859,
    FlashEnergy: 37387,
    SpatialFrequencyResponse: 37388,
    Noise: 37389,
    FocalPlaneXResolution: 37390,
    FocalPlaneYResolution: 37391,
    FocalPlaneResolutionUnit: 37392,
    ImageNumber: 37393,
    SecurityClassification: 37394,
    ImageHistory: 37395,
    ExposureIndex: 37397,
    TIFFEPStandardID: 37398,
    SensingMethod: 37399,
    XPTitle: 40091,
    XPComment: 40092,
    XPAuthor: 40093,
    XPKeywords: 40094,
    XPSubject: 40095,
    PrintImageMatching: 50341,
    DNGVersion: 50706,
    DNGBackwardVersion: 50707,
    UniqueCameraModel: 50708,
    LocalizedCameraModel: 50709,
    CFAPlaneColor: 50710,
    CFALayout: 50711,
    LinearizationTable: 50712,
    BlackLevelRepeatDim: 50713,
    BlackLevel: 50714,
    BlackLevelDeltaH: 50715,
    BlackLevelDeltaV: 50716,
    WhiteLevel: 50717,
    DefaultScale: 50718,
    DefaultCropOrigin: 50719,
    DefaultCropSize: 50720,
    ColorMatrix1: 50721,
    ColorMatrix2: 50722,
    CameraCalibration1: 50723,
    CameraCalibration2: 50724,
    ReductionMatrix1: 50725,
    ReductionMatrix2: 50726,
    AnalogBalance: 50727,
    AsShotNeutral: 50728,
    AsShotWhiteXY: 50729,
    BaselineExposure: 50730,
    BaselineNoise: 50731,
    BaselineSharpness: 50732,
    BayerGreenSplit: 50733,
    LinearResponseLimit: 50734,
    CameraSerialNumber: 50735,
    LensInfo: 50736,
    ChromaBlurRadius: 50737,
    AntiAliasStrength: 50738,
    ShadowScale: 50739,
    DNGPrivateData: 50740,
    MakerNoteSafety: 50741,
    CalibrationIlluminant1: 50778,
    CalibrationIlluminant2: 50779,
    BestQualityScale: 50780,
    RawDataUniqueID: 50781,
    OriginalRawFileName: 50827,
    OriginalRawFileData: 50828,
    ActiveArea: 50829,
    MaskedAreas: 50830,
    AsShotICCProfile: 50831,
    AsShotPreProfileMatrix: 50832,
    CurrentICCProfile: 50833,
    CurrentPreProfileMatrix: 50834,
    ColorimetricReference: 50879,
    CameraCalibrationSignature: 50931,
    ProfileCalibrationSignature: 50932,
    AsShotProfileName: 50934,
    NoiseReductionApplied: 50935,
    ProfileName: 50936,
    ProfileHueSatMapDims: 50937,
    ProfileHueSatMapData1: 50938,
    ProfileHueSatMapData2: 50939,
    ProfileToneCurve: 50940,
    ProfileEmbedPolicy: 50941,
    ProfileCopyright: 50942,
    ForwardMatrix1: 50964,
    ForwardMatrix2: 50965,
    PreviewApplicationName: 50966,
    PreviewApplicationVersion: 50967,
    PreviewSettingsName: 50968,
    PreviewSettingsDigest: 50969,
    PreviewColorSpace: 50970,
    PreviewDateTime: 50971,
    RawImageDigest: 50972,
    OriginalRawFileDigest: 50973,
    SubTileBlockSize: 50974,
    RowInterleaveFactor: 50975,
    ProfileLookTableDims: 50981,
    ProfileLookTableData: 50982,
    OpcodeList1: 51008,
    OpcodeList2: 51009,
    OpcodeList3: 51022,
    NoiseProfile: 51041,
  },
  ExifIFD: {
    ExposureTime: 33434,
    FNumber: 33437,
    ExposureProgram: 34850,
    SpectralSensitivity: 34852,
    ISOSpeedRatings: 34855,
    OECF: 34856,
    SensitivityType: 34864,
    StandardOutputSensitivity: 34865,
    RecommendedExposureIndex: 34866,
    ISOSpeed: 34867,
    ISOSpeedLatitudeyyy: 34868,
    ISOSpeedLatitudezzz: 34869,
    ExifVersion: 36864,
    DateTimeOriginal: 36867,
    DateTimeDigitized: 36868,
    ComponentsConfiguration: 37121,
    CompressedBitsPerPixel: 37122,
    ShutterSpeedValue: 37377,
    ApertureValue: 37378,
    BrightnessValue: 37379,
    ExposureBiasValue: 37380,
    MaxApertureValue: 37381,
    SubjectDistance: 37382,
    MeteringMode: 37383,
    LightSource: 37384,
    Flash: 37385,
    FocalLength: 37386,
    SubjectArea: 37396,
    MakerNote: 37500,
    UserComment: 37510,
    SubSecTime: 37520,
    SubSecTimeOriginal: 37521,
    SubSecTimeDigitized: 37522,
    FlashpixVersion: 40960,
    ColorSpace: 40961,
    PixelXDimension: 40962,
    PixelYDimension: 40963,
    RelatedSoundFile: 40964,
    InteroperabilityTag: 40965,
    FlashEnergy: 41483,
    SpatialFrequencyResponse: 41484,
    FocalPlaneXResolution: 41486,
    FocalPlaneYResolution: 41487,
    FocalPlaneResolutionUnit: 41488,
    SubjectLocation: 41492,
    ExposureIndex: 41493,
    SensingMethod: 41495,
    FileSource: 41728,
    SceneType: 41729,
    CFAPattern: 41730,
    CustomRendered: 41985,
    ExposureMode: 41986,
    WhiteBalance: 41987,
    DigitalZoomRatio: 41988,
    FocalLengthIn35mmFilm: 41989,
    SceneCaptureType: 41990,
    GainControl: 41991,
    Contrast: 41992,
    Saturation: 41993,
    Sharpness: 41994,
    DeviceSettingDescription: 41995,
    SubjectDistanceRange: 41996,
    ImageUniqueID: 42016,
    CameraOwnerName: 42032,
    BodySerialNumber: 42033,
    LensSpecification: 42034,
    LensMake: 42035,
    LensModel: 42036,
    LensSerialNumber: 42037,
    Gamma: 42240,
  },
  GPSIFD: {
    GPSVersionID: 0,
    GPSLatitudeRef: 1,
    GPSLatitude: 2,
    GPSLongitudeRef: 3,
    GPSLongitude: 4,
    GPSAltitudeRef: 5,
    GPSAltitude: 6,
    GPSTimeStamp: 7,
    GPSSatellites: 8,
    GPSStatus: 9,
    GPSMeasureMode: 10,
    GPSDOP: 11,
    GPSSpeedRef: 12,
    GPSSpeed: 13,
    GPSTrackRef: 14,
    GPSTrack: 15,
    GPSImgDirectionRef: 16,
    GPSImgDirection: 17,
    GPSMapDatum: 18,
    GPSDestLatitudeRef: 19,
    GPSDestLatitude: 20,
    GPSDestLongitudeRef: 21,
    GPSDestLongitude: 22,
    GPSDestBearingRef: 23,
    GPSDestBearing: 24,
    GPSDestDistanceRef: 25,
    GPSDestDistance: 26,
    GPSProcessingMethod: 27,
    GPSAreaInformation: 28,
    GPSDateStamp: 29,
    GPSDifferential: 30,
    GPSHPositioningError: 31,
  },
  InteropIFD: {
    InteroperabilityIndex: 1,
  },
};
