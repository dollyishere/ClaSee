package com.ssafy.api.dto;

import com.ssafy.api.response.UserSaltRes;
import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LessonSearchFilterDto {
    String name;
    Long minPrice;
    Long maxPrice;
    Long minStartTime;
    Long maxStartTime;
    String category;
    String dayOfWeek;
}