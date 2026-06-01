package com.csa.member.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.common.R;
import com.csa.member.entity.CsaMember;
import com.csa.member.service.CsaMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "成员管理")
@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class CsaMemberController {

    private final CsaMemberService csaMemberService;

    @Operation(summary = "分页查询成员列表")
    @GetMapping
    public R<IPage<CsaMember>> list(@RequestParam(defaultValue = "1") int page,
                                     @RequestParam(defaultValue = "10") int size,
                                     @RequestParam(required = false) String cohort,
                                     @RequestParam(required = false) String major,
                                     @RequestParam(required = false) String status,
                                     @RequestParam(required = false) String keyword) {
        IPage<CsaMember> result = csaMemberService.listPage(page, size, cohort, major, status, keyword);
        return R.ok(result);
    }

    @Operation(summary = "根据ID获取成员")
    @GetMapping("/{id}")
    public R<CsaMember> getById(@PathVariable Long id) {
        CsaMember member = csaMemberService.getById(id);
        if (member == null) {
            return R.fail("成员不存在");
        }
        return R.ok(member);
    }

    @Operation(summary = "新增成员")
    @PostMapping
    public R<Void> create(@RequestBody CsaMember member) {
        boolean success = csaMemberService.save(member);
        if (!success) {
            return R.fail("新增失败");
        }
        return R.ok();
    }

    @Operation(summary = "更新成员")
    @PutMapping("/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody CsaMember member) {
        member.setId(id);
        boolean success = csaMemberService.update(member);
        if (!success) {
            return R.fail("更新失败");
        }
        return R.ok();
    }

    @Operation(summary = "删除成员")
    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable Long id) {
        boolean success = csaMemberService.delete(id);
        if (!success) {
            return R.fail("删除失败");
        }
        return R.ok();
    }

    @Operation(summary = "更新成员状态")
    @PutMapping("/{id}/status")
    public R<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        boolean success = csaMemberService.updateStatus(id, status);
        if (!success) {
            return R.fail("状态更新失败");
        }
        return R.ok();
    }
}
