from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from cl.api.api_permissions import IsOwner
from cl.api.utils import LoggingMixin, MediumAdjustablePagination
from cl.favorites.api_permissions import IsTagOwner
from cl.favorites.api_serializers import UserTagSerializer, DocketTagSerializer
from cl.favorites.filters import UserTagFilter, DocketTagFilter
from cl.favorites.models import UserTag, DocketTag


class UserTagViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = UserTagSerializer
    pagination_class = MediumAdjustablePagination
    filter_class = UserTagFilter
    ordering_fields = (
        "date_created",
        "date_modified",
        "name",
        "view_count",
    )

    def get_queryset(self):
        return UserTag.objects.filter(
            Q(user=self.request.user) | Q(published=True)
        ).order_by("-id")


class DocketTagViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsTagOwner]
    serializer_class = DocketTagSerializer
    filter_class = DocketTagFilter
    pagination_class = MediumAdjustablePagination

    def get_queryset(self):
        return DocketTag.objects.filter(
            Q(tag__user=self.request.user) | Q(tag__published=True)
        )
