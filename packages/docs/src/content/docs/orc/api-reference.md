---
title: ORC API Reference
description: API docs that describe how to control the Orbital Refuse Collector (ORC) system
head: []
---

## Satellites

### List All Satellites

Returns a list of satellites for the current organization.

```http
GET /api/satellites
```

#### Response

```json
[
	{
		"id": "leo-001",
		"name": "Leona",
		"orbit_type": "LEO",
		"organization": "Amarr Empire",
		"status": "operational"
	},
	{
		"id": "geo-001",
		"name": "George",
		"orbit_type": "GEO",
		"organization": "Amarr Empire",
		"status": "operational"
	}
]
```

### Get Satellite Details

Returns telemetry for a specific satellite.

```http
GET /api/satellites/{id}
```

#### Parameters

| Name | Type   | Description                            |
| ---- | ------ | -------------------------------------- |
| `id` | string | The unique identifier of the satellite |

#### Response

```json
{
	"id": "leo-001",
	"name": "Leona",
	"altitude (km)": 650,
	"orbit type": "low earth orbit",
	"status": "operational",
	"velocity (km/h)": 27000,
	"integrity": 0.98
}
```

## Operations

### Decommission Satellite

Initiates the autonomous capture and deorbit sequence for a target.

```http
POST /api/satellites/{id}/decommission
```

:::note[Async Operation]
This endpoint returns immediately. The decommission process is asynchronous and may take several hours or days to complete.
:::

#### Response

```json
{
	"jobId": "job-12345",
	"status": "initiated",
	"estimatedCompletion (minutes)": 40722
}
```

### Get Job Status

Check the status of a decommission operation.

```http
GET /api/jobs/{jobId}
```

#### Response

```json
{
	"jobId": "job-12345",
	"status": "in_progress",
	"phase": "capture",
	"progress": 0.65
}
```

#### Job Statuses

| Status        | Description                      |
| ------------- | -------------------------------- |
| `initiated`   | Job created, awaiting processing |
| `in_progress` | Decommission sequence active     |
| `completed`   | Target successfully deorbited    |
| `failed`      | Operation aborted or failed      |

## Error Codes

| Code  | Description                            |
| ----- | -------------------------------------- |
| `400` | Invalid request parameters             |
| `404` | Satellite not found                    |
| `409` | Satellite already being decommissioned |
| `429` | Rate limit exceeded                    |
| `500` | Internal server error                  |

### Error Response Format

```json
{
	"error": {
		"code": "SATELLITE_NOT_FOUND",
		"message": "No satellite found with ID 'xyz-999'",
		"details": {}
	}
}
```

## Authentication

The ORC API authenticates requests via OAuth 2.0 bearer tokens.

```http
Authorization: Bearer <your-token>
```

## Rate Limits

| Environment | Limit                  |
| ----------- | ---------------------- |
| Demo        | 100 requests/minute    |
| Development | 1,000 requests/minute  |
| Production  | 10,000 requests/minute |

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699999999
```
