using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Globalization;

public class JsonDateTimeConverter : JsonConverter<DateTime>
{
    private readonly string _format;

    public JsonDateTimeConverter(string format)
    {
        _format = format;
    }

    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        string? dateString = reader.GetString();
        if (dateString == null)
        {
            throw new JsonException("El valor de fecha es nulo.");
        }

        if (DateTime.TryParseExact(dateString, _format, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
        {
            return date;
        }
        throw new JsonException($"La fecha '{dateString}' no tiene el formato esperado '{_format}'.");
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(_format, CultureInfo.InvariantCulture));
    }
}

