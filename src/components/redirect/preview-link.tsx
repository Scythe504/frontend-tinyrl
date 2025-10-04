import { Card, CardContent, CardDescription, CardHeader } from "../ui/card"
import { Input } from "../ui/input"
import { Skeleton } from "../ui/skeleton"

export const PreviewLink = ({
  fullUrl,
  loading = false,
}: {
  fullUrl: string
  loading: boolean
}) => {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardDescription>Destination</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {loading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Input
              value={fullUrl || "Unknown destination"}
              readOnly
              className="w-full text-muted-foreground"
              aria-label="Redirect destination URL"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
