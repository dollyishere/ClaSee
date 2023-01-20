package com.ssafy.db.entity.lesson;

import lombok.Getter;

import javax.persistence.*;

/*
* lesson : curri = 1 : N
*/
@Entity
@Getter
@Table(name = "CURRICULUM")
public class Curriculum {
    @Id
    @GeneratedValue
    private Long id;

    private Long stage;
    private String description;

    // 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}
